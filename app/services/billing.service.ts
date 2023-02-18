import { Service } from "typedi"
import axios from "axios"
import { Subscription } from "@app/models/subscription.model"
import { User } from "@app/models/user.model"
import { AdminService } from "@app/services/admin.service"

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
  constructor(private readonly adminService: AdminService) {}
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
            jitsi.jid === "objective@muc.meet.jitsi" && // jitsi.speakerStats must contain Troplo with a dominant speaker time of 1h
            jitsi.speakerStats.some(
              (speaker: JitsiSpeakers) =>
                speaker.username === "Troplo" &&
                speaker.totalDominantSpeakerTime > 1000 * 60 * 60
            ) &&
            jitsi.speakerStats.some((speaker: JitsiSpeakers) =>
              [
                "Jolt",
                "Dhease",
                "Dhease Nheeights",
                "Jolt707",
                "Jensen",
                "Nesy",
                "JJS707"
              ].includes(speaker.username)
            )
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
          if (!subscription) return
          // @ts-ignore
          const meta = subscription.metadata?.active
          const hasExpired =
            new Date(subscription.expiredAt).getTime() < new Date().getTime() &&
            subscription.expiredAt
          if (!hasExpired) {
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
          }
          await Subscription.update(
            {
              metadata: {
                message: `You don't have 14 hours of Speaker Stats in the past 14 days, your TPU Gold will expire in 1 day. You only have ${Math.round(
                  nesyLength
                )} hours.`,
                hours: nesyLength,
                active: !hasExpired
              }
            },
            {
              where: {
                userId: 6
              }
            }
          )
          if (!subscription) return
          if (hasExpired) {
            const user = await User.findOne({
              where: {
                id: 6
              }
            })
            console.log("[BILLING] Jolt707's subscription expired")
            // @ts-ignore
            if (meta && user) {
              this.adminService.sendEmail(
                {
                  body: {
                    intro: `Your TPU Gold has expired!`,
                    title: `Hello ${user.username}.`,
                    action: [
                      {
                        instructions: `Your TPU Gold has expired. You only have ${Math.round(
                          nesyLength
                        )} hours of Speaker Stats in the past 14 days. You need 14 hours to keep your TPU Gold.`,
                        button: {
                          color: "#0190ea", // Optional action button color
                          text: "Go to TPU",
                          link: config.hostnameWithProtocol + "/"
                        }
                      }
                    ]
                  }
                },
                user.email,
                "Your TPU Gold has expired!"
              )
            }
            await Subscription.update(
              {
                cancelled: true,
                metadata: {
                  active: false,
                  hours: nesyLength
                }
              },
              {
                where: {
                  userId: 6
                }
              }
            )
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
              userId: 6
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
              ),
              metadata: {
                hours: nesyLength,
                active: true
              }
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
      .catch(() => {})
    return true
  }

  billingInit() {
    try {
      // 30 minutes
      setInterval(this.checkJitsiGold, 1000 * 60 * 30)

      this.checkJitsiGold().then(() => {})
      return true
    } catch {
      return false
    }
  }
}
