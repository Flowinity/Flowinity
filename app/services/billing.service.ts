import { Service } from "typedi"
import axios from "axios"
import { Subscription } from "@app/models/subscription.model"
import { User } from "@app/models/user.model"

type Jitsi = {
  id: string
  createdAt: string
  updatedAt: string
  active: boolean
  jid: string
  occupants: JitsiOccupant[]
  polls: object[]
  raw: object
  speakerStats: JitsiSpeakers[]
}

type JitsiOccupant = {
  active: boolean
  id: string
  email: string
  nick: string
  sourceInfo: string
  statsId: string
  codecType: string
}

type JitsiSpeakers = {
  id: string
  username: string
  isSilent: boolean
  isDominantSpeaker: boolean
  dominantSpeakerStart: number
  totalDominantSpeakerTime: number
}

@Service()
export class BillingService {
  async createSubscription(id: number) {
    return await Subscription.create({
      planId: 6,
      userId: id,
      price: 0,
      cancelled: false,
      paymentId: 0,
      expiredAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 14)
    })
  }
  async checkJitsiGold() {
    console.log("[BILLING] Checking Gold")
    axios
      .get("http://localhost:24004/api/v1/jitsi", {
        headers: {
          Authorization: config.jitsiToken
        }
      })
      .then(async (res) => {
        // get Jitsi's created in the last 14d
        const filtered = res.data.filter((jitsi: Jitsi) => {
          return (
            new Date(jitsi.createdAt).getTime() >
              new Date().getTime() - 1000 * 60 * 60 * 24 * 14 &&
            jitsi.jid === "objective@muc.meet.jitsi"
          )
        })
        console.log(
          "[BILLING] " +
            filtered.length +
            " Jitsi rooms created in the last 14d"
        )
        let nesyLength = 0
        for (const jitsi of filtered) {
          for (const speaker of jitsi.speakerStats) {
            if (
              speaker.username === "Jolt" ||
              speaker.username === "Dhease" ||
              speaker.username === "Dhease Nheeights" ||
              speaker.username === "Jolt707" ||
              speaker.username === "Jensen" ||
              speaker.username === "Nesy" ||
              speaker.username === "JJS707"
            ) {
              nesyLength += speaker.totalDominantSpeakerTime
            }
          }
        }
        // from ms to hours
        nesyLength = nesyLength / 1000 / 60 / 60
        console.log(
          "[BILLING] " +
            nesyLength +
            "h of dominant speaker time in the last 14d (Jolt707)"
        )
        if (nesyLength < 14) {
          const subscription = await Subscription.findOne({
            where: {
              userId: 6
            }
          })
          if (!subscription) {
            console.log("[BILLING] Creating subscription for Jolt707")
            await this.createSubscription(6)
          }
          await Subscription.update(
            {
              cancelled: true,
              // expire in 24h
              cancelledAt: new Date(),
              expiredAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
            },
            {
              where: {
                userId: 6,
                cancelled: false
              }
            }
          )
          await Subscription.update(
            {
              metadata: {
                message: `You don't have 14 hours of Speaker Stats in the past 14 days, your TPU Gold will expire in 1 day. You only have ${Math.round(
                  nesyLength
                )} hours.`
              }
            },
            {
              where: {
                userId: 6
              }
            }
          )
          if (!subscription) return
          if (
            new Date(subscription.expiredAt).getTime() < new Date().getTime() &&
            subscription.expiredAt
          ) {
            console.log("[BILLING] Jolt707's subscription expired")
            await Subscription.destroy({
              where: {
                userId: 6
              }
            })
            await User.update(
              {
                planId: 1
              },
              {
                where: {
                  id: 6
                }
              }
            )
          }
        } else {
          const subscription = await Subscription.findOne({
            where: {
              userId: 1
            }
          })
          if (!subscription) {
            console.log("[BILLING] Creating subscription for Jolt707")
            await this.createSubscription(6)
          }
          await Subscription.update(
            {
              cancelled: false,
              cancelledAt: null,
              expiredAt: new Date(
                new Date().getTime() + 1000 * 60 * 60 * 24 * 14
              )
            },
            {
              where: {
                userId: 6
              }
            }
          )
          console.log("[BILLING] Jolt707's subscription is valid")
        }
      })
    return true
  }

  billingInit() {
    try {
      console.log("test")
      // 4 hours
      setInterval(this.checkJitsiGold, 14400000)

      this.checkJitsiGold().then(() => {})
      return true
    } catch {
      return false
    }
  }
}
