import { Service } from "typedi"
import { ImapFlow } from "imapflow"
import { simpleParser } from "mailparser"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import { Op } from "sequelize"

@Service()
export class MailService {
  async connect(userId: number) {
    const user = await User.findOne({
      where: {
        id: userId,
        mailToken: {
          [Op.ne]: null
        }
      },
      attributes: ["mailToken", "username"]
    })
    if (!user) throw Errors.USER_NOT_FOUND
    const client = new ImapFlow({
      host: "mail.troplo.com",
      port: 993,
      secure: true,
      auth: {
        user: `${user.username.toLowerCase()}@troplo.com`,
        pass: user.mailToken
      },
      logger: false
    })
    await client.connect()
    return client
  }
  async getMailboxes(userId: number) {
    const client = await this.connect(userId)
    const mailboxes = await client.list()
    client.logout()
    return mailboxes
  }
  async getMessages(userId: number, mailbox: string, page: number = 1) {
    const client = await this.connect(userId)
    await client.mailboxOpen(mailbox)
    let messages = []
    // @ts-ignore
    let message = await client.fetchOne(client.mailbox.exists, {
      source: true
    })
    console.log(message)
    if (message.seq < 50) {
      for await (let msg of client.fetch(`*`, {
        envelope: true
      })) {
        messages.push(msg)
      }
    } else {
      for await (let msg of client.fetch(`${message.seq}:${message.seq - 50}`, {
        envelope: true
      })) {
        messages.push(msg)
      }
    }
    console.log(messages.length)
    client.logout()
    return messages
      .map((msg) => {
        return {
          ...msg.envelope,
          uid: msg.uid,
          seq: msg.seq
        }
      })
      .reverse()
  }
  async getMessage(userId: number, mailbox: string, uid: string) {
    const client = await this.connect(userId)
    await client.mailboxOpen(mailbox)
    console.log(uid === "22728")
    //@ts-ignore
    const message = await client.fetchOne(uid, {
      uid: true,
      bodyStructure: true,
      envelope: true,
      source: true
    })
    client.logout()
    // Buffer to HTML

    console.log(message)
    return {
      ...message,
      modseq: message.modseq.toString(),
      source: message.source.toString(),
      parsed: await simpleParser(message.source)
    }
  }
}
