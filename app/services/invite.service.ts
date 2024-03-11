import { Container, Service } from "typedi"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import { Invite } from "@app/models/invite.model"
import { Upload } from "@app/models/upload.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { partialUserBase } from "@app/classes/graphql/user/partialUser"
import { EmailNotificationService } from "@app/services/emailNotification.service"

@Service()
export class InviteService {
  async createInvite(userId: number, email: string): Promise<Invite> {
    const existingInvite = await Invite.findOne({
      where: {
        email
      }
    })
    const existingUser = await User.findOne({
      where: {
        email
      }
    })
    if (existingUser) throw Errors.USER_ALREADY_EXISTS_IAF
    if (existingInvite) {
      // ensure it's older than 14 days
      if (dayjs().diff(existingInvite.createdAt, "days") >= 14) {
        await existingInvite.destroy()
      } else {
        throw Errors.USER_ALREADY_INVITED_IAF
      }
    }
    const invite = await Invite.create({
      userId,
      email,
      status: "accepted"
    })
    const emailNotificationService = Container.get(EmailNotificationService)
    emailNotificationService.inviteAFriendAccept(invite)
    return invite
  }

  async useInvite(inviteKey: string, userId: number): Promise<boolean> {
    await Invite.update(
      {
        registerUserId: userId
      },
      {
        where: {
          inviteKey
        }
      }
    )
    return true
  }

  async getInviteCache(inviteKey: string) {
    const cache = await redis.json.get(`invites:${inviteKey}`)
    if (cache) {
      console.log(cache)
      return cache
    }
    const inv = await this.getInvite(inviteKey)
    if (!inv) return null
    const invite = {
      ...inv,
      facts: await this.getFacts(inviteKey)
    }
    redis.json.set(`invites:${inviteKey}`, "$", invite, {
      EX: 43200
    })
    return invite
  }

  async getInvite(inviteKey: string) {
    if (!inviteKey) return null
    const invite = await Invite.findOne({
      where: {
        inviteKey
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        }
      ]
    })

    if (!invite) {
      return null
    }

    return {
      ...invite.toJSON(),
      facts: await this.getFacts(inviteKey)
    }
  }

  async getFacts(inviteKey: string): Promise<string[]> {
    let result = []

    const invite = await Invite.findOne({
      where: {
        inviteKey
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        }
      ]
    })
    if (!invite) throw Errors.INVITE_NOT_FOUND
    // user-uploads
    const userUploads = await Upload.count({
      where: {
        userId: invite.userId
      }
    })
    result.push(
      `${
        invite.user.username
      } has uploaded ${userUploads.toLocaleString()} items to ${
        config.siteName
      }.`
    )
    // user-percentage
    const uploads = await Upload.count()
    result.push(
      `${invite.user.username} has uploaded ${
        Math.round((userUploads / uploads) * 10000) / 100 + "%"
      } of the total uploads to ${config.siteName}.`
    )
    // total-uploads
    result.push(
      `${config.siteName} has a total of ${uploads.toLocaleString()} uploads.`
    )
    // total-collectivized
    const collectionItems = await CollectionItem.findAll({
      attributes: ["userId"]
    })
    const totalCollectivized = collectionItems.filter(
      (item) => item.userId === invite.userId
    ).length
    result.push(
      `${
        invite.user.username
      } has put ${totalCollectivized.toLocaleString()} items in ${
        config.siteName
      } collections.`
    )
    result.push(
      `${totalCollectivized.toLocaleString()} items have been collectivized out of ${collectionItems.length.toLocaleString()} total items. That's ${
        Math.round((totalCollectivized / collectionItems.length) * 10000) / 100
      }%!`
    )
    return result
  }
}
