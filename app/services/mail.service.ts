import { Service } from "typedi"
import { ImapFlow } from "imapflow"
import { simpleParser } from "mailparser"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import { Op } from "sequelize"
import { GqlError } from "@app/lib/gqlErrors"

@Service()
export class MailService {
  async connect(userId: number, gql?: boolean) {
    const user = await User.findOne({
      where: {
        id: userId,
        mailToken: {
          [Op.ne]: null
        }
      },
      attributes: ["mailToken", "username"]
    })
    if (!user) {
      if (gql) throw new GqlError("EXPERIMENT_NOT_ALLOWED")
      throw Errors.EXPERIMENT_NOT_ALLOWED
    }
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

  async idle(userId: number) {
    const client = await this.connect(userId)
    await client.idle()
    return client
  }

  async getMailboxes(userId: number, gql?: boolean) {
    const client = await this.connect(userId, gql)
    const mailboxes = await client.list()
    client.logout()
    return mailboxes
  }

  async getUnread(userId: number) {
    const client = await this.connect(userId, true)
    const mailboxes = await client.list()
    let unread = 0
    for (const mailbox of mailboxes) {
      try {
        await client.mailboxOpen(mailbox.name)
        // get the number of unread messages
        const { unseen } = await client.status(mailbox.name, {
          unseen: true
        })
        if (unseen) unread += unseen
      } catch {}
    }
    client.logout()
    return unread
  }

  async getMessages(userId: number, mailbox: string, gql?: boolean) {
    const client = await this.connect(userId, gql)
    await client.mailboxOpen(mailbox)
    let messages = []
    // @ts-ignore
    let message = await client.fetchOne(client.mailbox.exists, {
      source: true
    })
    if (message.seq < 50) {
      for await (let msg of client.fetch(
        {},
        {
          envelope: true
        }
      )) {
        messages.push(msg)
      }
    } else {
      for await (let msg of client.fetch(`${message.seq}:${message.seq - 50}`, {
        envelope: true
      })) {
        messages.push(msg)
      }
    }
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

  async getMessage(
    userId: number,
    mailbox: string,
    uid: string,
    gql?: boolean
  ) {
    const client = await this.connect(userId, gql)
    await client.mailboxOpen(mailbox)
    //@ts-ignore
    const message = await client.fetchOne(uid, {
      uid: true,
      bodyStructure: true,
      envelope: true,
      source: true
    })
    client.logout()
    // Buffer to HTML
    const parser = await simpleParser(message.source)
    return {
      ...message,
      modseq: message.modseq.toString(),
      source: message.source.toString(),
      parsed: {
        ...parser,
        html:
          parser.html || parser.textAsHtml || "No message content to display"
      }
    }
  }
}
