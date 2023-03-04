import { Service } from "typedi"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import { Upload } from "@app/models/upload.model"
import { Op } from "sequelize"
import { Pulse } from "@app/models/pulse.model"
import uaParser from "ua-parser-js"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Message } from "@app/models/message.model"
import { Chat } from "@app/models/chat.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { Insight } from "@app/models/insight.model"

export class HoursOfDay {
  hours: { [key: string]: number } = {
    "12 AM": 0,
    "1 AM": 0,
    "2 AM": 0,
    "3 AM": 0,
    "4 AM": 0,
    "5 AM": 0,
    "6 AM": 0,
    "7 AM": 0,
    "8 AM": 0,
    "9 AM": 0,
    "10 AM": 0,
    "11 AM": 0,
    "12 PM": 0,
    "1 PM": 0,
    "2 PM": 0,
    "3 PM": 0,
    "4 PM": 0,
    "5 PM": 0,
    "6 PM": 0,
    "7 PM": 0,
    "8 PM": 0,
    "9 PM": 0,
    "10 PM": 0,
    "11 PM": 0
  }
}

@Service()
export class PulseService {
  async getLatestReport(userId: number, type: "weekly" | "monthly" | "yearly") {
    const latestReport = await Insight.findOne({
      order: [["createdAt", "DESC"]],
      where: {
        userId,
        type
      }
    })
    if (latestReport) return latestReport
    else return null
  }
  async pulseInit() {
    //console.log(await this.generateWeeklyInsights(1))
  }
  calculatePulseDays(pulses: Pulse[]) {
    let hoursLastWeek = {}
    for (let i = 0; i < 7; i++) {
      const date = dayjs().subtract(7, "days").startOf("isoWeek").add(i, "days")
      hoursLastWeek[date.format("dddd (DD)")] = 0
    }
    for (const pulse of pulses) {
      const day = dayjs(pulse.createdAt).format("dddd (DD)")
      // convert from ms to hours
      const timeSpent = pulse.timeSpent / 1000 / 60 / 60
      hoursLastWeek[day] =
        Math.round(
          ((hoursLastWeek[day] || 0) + timeSpent) * 100 + Number.EPSILON
        ) / 100
    }
    return hoursLastWeek
  }
  calculatePlatforms(pulses: Pulse[]) {
    let platforms = {}
    for (const pulse of pulses) {
      const parser: any = uaParser(pulse.sysInfo.ua)
      if (!platforms[parser.os.name]) platforms[parser.os.name] = 0
      platforms[parser.os.name] += pulse.timeSpent / 1000 / 60 / 60
    }
    for (const [key, value] of Object.entries(platforms)) {
      // @ts-ignore
      platforms[key] = Math.round(value * 100) / 100
    }
    return platforms
  }
  calculateWords(uploads: Upload[]) {
    const words = uploads.map((upload) => upload.textMetadata)
    const wordsArray = words.join(" ").split(" ")
    const wordsArrayFiltered = wordsArray.filter((word) => word.length > 2)
    const wordsArrayFilteredCounted = wordsArrayFiltered.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1
      return acc
    }, {})
    return Object.keys(wordsArrayFilteredCounted).map((key) => ({
      word: key,
      count: wordsArrayFilteredCounted[key]
    }))
  }
  getChatName(chat: Chat, userId: number) {
    if (chat.name && chat.type === "group") return chat.name
    if (chat.type === "direct") {
      const chatAssociation = chat.users.find(
        (chatAssociation) => chatAssociation.userId !== userId
      )
      if (!chatAssociation) return "Unknown"
      return chatAssociation.user.username
    }
    return "Unknown"
  }
  getFeatures(pulses: Pulse[]) {
    const definitions = {
      "/autoCollect": "AutoCollects",
      "/notes": "Workspaces",
      "/workspaces": "Workspaces",
      "/collections": "Collections",
      "/communications": "Communications",
      "/mail": "Mail",
      "/u/": "Users",
      "/gallery": "Gallery",
      "/starred": "Starred",
      "/insights": "Insights",
      "/admin": "Admin/HLP"
    }
    // Pulses have a route property that is the url path, anything starting with the above keys is counted as a feature
    const features = {}
    for (const pulse of pulses) {
      // check if it's in the above definitions, if not, add to "Other"
      const feature = Object.keys(definitions).find((key) =>
        pulse.route.startsWith(key)
      )
      if (!feature) {
        features["Other"] =
          (features["Other"] || 0) + pulse.timeSpent / 1000 / 60 / 60
      } else {
        features[definitions[feature]] =
          (features[definitions[feature]] || 0) +
          pulse.timeSpent / 1000 / 60 / 60
      }
    }
    for (const [key, value] of Object.entries(features)) {
      // @ts-ignore
      features[key] = Math.round(value * 100) / 100
    }
    // from Object to Array like [{name: "AutoCollects", count: 10}, {name: "Workspaces", count: 5}]
    return Object.keys(features)
      .sort()
      .map((key) => ({
        name: key,
        count: features[key]
      }))
  }
  async generateWeeklyInsights(userId: number) {
    const previous = await this.getLatestReport(userId, "weekly")
    // UPLOADS
    const uploads = await Upload.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Op.gte]: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })

    let hours = new HoursOfDay().hours
    for (const upload of uploads) {
      const hour = dayjs(upload.createdAt).format("h A")
      hours[hour] = (hours[hour] || 0) + 1
    }

    // PULSE
    const pulses = await Pulse.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Op.gte]: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })

    // CHATS
    const messages = await Message.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Op.gte]: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: [
        {
          model: Chat,
          as: "chat",
          include: [
            {
              model: ChatAssociation,
              as: "users",
              include: [
                {
                  model: User,
                  as: "tpuUser",
                  attributes: ["id", "username", "avatar"]
                },
                {
                  model: LegacyUser,
                  as: "legacyUser",
                  attributes: ["id", "username", "avatar"]
                }
              ]
            }
          ]
        }
      ]
    })

    let topChats = {}
    for (const message of messages) {
      const chatName = <string>this.getChatName(message.chat, userId)
      if (!topChats[chatName]) topChats[chatName] = 0
      topChats[chatName] += 1
    }

    topChats = Object.keys(topChats)
      .sort((a, b) => topChats[b] - topChats[a])
      .slice(0, 15)
      .map((key) => ({ chatName: key, count: topChats[key] }))

    // RESULT
    const insights = {
      uploads: {
        total: {
          now: uploads.length,
          previous: previous ? previous.data?.uploads?.total?.previous : 0
        },
        average: {
          now: Math.round((uploads.length / 7) * 100) / 100,
          previous: previous ? previous.data?.uploads?.average : 0
        },
        hours: hours,
        words: this.calculateWords(uploads)
      },
      pulses: {
        total: {
          now: pulses.length,
          previous: previous ? previous.data?.pulses?.total?.previous : 0
        },
        average: Math.round((pulses.length / 7) * 100) / 100,
        platforms: this.calculatePlatforms(pulses),
        days: this.calculatePulseDays(pulses),
        features: this.getFeatures(pulses)
      },
      messages: {
        total: {
          now: messages.length,
          previous: previous ? previous.data?.messages?.total?.previous : 0
        },
        average: {
          now: Math.round((messages.length / 7) * 100) / 100,
          previous: previous ? previous.data?.messages?.average : 0
        },
        topChats
      },
      workspaces: {},
      _version: 1
    }
    await Insight.create({
      userId: userId,
      data: insights,
      type: "weekly",
      startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    })
    return insights
  }
  async getCachedLeaderboard() {
    const leaderboard = await redis.json.get(`insights:leaderboard`)
    if (leaderboard) {
      return leaderboard
    } else {
      const leaderboard = await this.getLeaderboard()
      await redis.json.set(`insights:leaderboard`, leaderboard)
      return leaderboard
    }
  }

  async getLeaderboard() {
    const users = await User.findAll()
    const totalUploads = await Upload.count()
    let result = []
    for (let user of users) {
      const count = await Upload.count({
        where: {
          userId: user.id
        }
      })
      result.push({
        username: user.username,
        id: user.id,
        avatar: user.avatar,
        // @ts-ignore
        uploads: count,
        percentage: Math.round((count / totalUploads) * 100 * 100) / 100
      })
    }
    return result.sort((a, b) => b.uploads - a.uploads)
  }

  async getCachedInsights(
    userId: number,
    year: string | number,
    global: boolean,
    reqUserId: number
  ) {
    let insights = await redis.json.get(`insights:${userId}`)
    if (insights) {
      if (reqUserId !== userId)
        insights[year].words = [{ word: "[Redacted]", count: 4154 }]
      return insights[year]
    } else {
      insights = await this.getInsights(userId, year, global)
      if (reqUserId !== userId)
        insights.words = [{ word: "[Redacted]", count: 4154 }]
      return insights
    }
  }

  // needs to be rewritten, probably.
  async getInsights(
    userId: number | null,
    year: string | number,
    global: boolean = false
  ): Promise<any> {
    if (!global) {
      const user = await User.findOne({
        where: {
          id: userId
        }
      })

      if (!user) {
        throw Errors.USER_NOT_FOUND
      }
    }

    const userWhere = global ? {} : { userId }

    const where =
      year === "latest"
        ? {}
        : {
            createdAt: {
              [Op.gte]: dayjs(year, "YYYY").toDate(),
              [Op.lt]: dayjs(year, "YYYY").add(1, "year").toDate()
            }
          }

    const uploadsCurrent = await Upload.count({
      where: {
        ...userWhere,
        createdAt: {
          [Op.gte]: dayjs().subtract(14, "days").toDate(),
          [Op.lt]: dayjs().subtract(7, "days").toDate()
        }
      }
    })

    // week before
    const uploadsLast = await Upload.count({
      where: {
        ...userWhere,
        createdAt: {
          [Op.gte]: dayjs().subtract(21, "days").toDate(),
          [Op.lt]: dayjs().subtract(14, "days").toDate()
        }
      }
    })

    const uploads = await Upload.findAll({
      where: {
        ...userWhere,
        ...where
      }
    })

    const words = uploads.map((upload) => upload.textMetadata)
    const wordsArray = words.join(" ").split(" ")
    const wordsArrayFiltered = wordsArray.filter((word) => word.length > 2)
    const wordsArrayFilteredCounted = wordsArrayFiltered.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1
      return acc
    }, {})
    const wordsObject = global
      ? [
          {
            word: "[Redacted]",
            count: 4154
          }
        ]
      : Object.keys(wordsArrayFilteredCounted).map((key) => ({
          word: key,
          count: wordsArrayFilteredCounted[key]
        }))

    // uploads per weekday and month
    let weekdays = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0
    }
    let months = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0
    }
    for (const upload of uploads) {
      const monthName = dayjs(upload.createdAt).format("MMMM")
      const weekdayName = dayjs(upload.createdAt).format("dddd")
      weekdays[weekdayName] = (weekdays[weekdayName] || 0) + 1
      months[monthName] = (months[monthName] || 0) + 1
    }
    // uploads per hour
    let hours = new HoursOfDay().hours
    for (const upload of uploads) {
      const hour = dayjs(upload.createdAt).format("h A")
      hours[hour] = (hours[hour] || 0) + 1
    }
    let years = {}
    for (const upload of uploads) {
      const year = dayjs(upload.createdAt).format("YYYY")
      years[year] = (years[year] || 0) + 1
    }
    // get hour usage last week using Pulse
    const pulses = await Pulse.findAll({
      where: {
        ...userWhere,
        createdAt: {
          [Op.gte]: dayjs().subtract(7, "days").startOf("isoWeek").toDate(),
          [Op.lt]: dayjs().subtract(7, "days").endOf("isoWeek").toDate()
        },
        timeSpent: {
          [Op.gt]: 0
        },
        other: {
          type: "session"
        }
      }
    })
    let hoursLastWeek = {}
    for (let i = 0; i < 7; i++) {
      const date = dayjs().subtract(7, "days").startOf("isoWeek").add(i, "days")
      hoursLastWeek[date.format("dddd (DD)")] = 0
    }
    for (const pulse of pulses) {
      const day = dayjs(pulse.createdAt).format("dddd (DD)")
      // convert from ms to hours
      const timeSpent = pulse.timeSpent / 1000 / 60 / 60
      hoursLastWeek[day] =
        Math.round(
          ((hoursLastWeek[day] || 0) + timeSpent) * 100 + Number.EPSILON
        ) / 100
    }
    const allPulses = await Pulse.findAll({
      where: {
        ...userWhere,
        timeSpent: {
          [Op.gt]: 0
        },
        other: {
          type: "session"
        }
      }
    })
    let totalPulseHours = {}
    for (const pulse of allPulses) {
      const day = dayjs(pulse.createdAt).format("DD/MM/YYYY")
      // convert from ms to hours
      const timeSpent = pulse.timeSpent / 1000 / 60 / 60
      totalPulseHours[day] =
        Math.round(
          ((totalPulseHours[day] || 0) + timeSpent) * 100 + Number.EPSILON
        ) / 100
    }
    // convert to array
    let totalPulseHoursArray = [0]
    for (const [, value] of Object.entries(totalPulseHours)) {
      if (typeof value === "number") {
        totalPulseHoursArray.push(value)
      }
    }
    if (!totalPulseHoursArray.length) {
      totalPulseHoursArray = [0]
    }
    const average = (array: any[]) =>
      array.reduce((a, b) => a + b) / array.length

    // hours on platforms based on Pulse UA
    let platforms = {}
    for (const pulse of allPulses) {
      const parser: any = uaParser(pulse.sysInfo.ua)
      if (!platforms[parser.os.name]) platforms[parser.os.name] = 0
      platforms[parser.os.name] += pulse.timeSpent / 1000 / 60 / 60
    }
    for (const [key, value] of Object.entries(platforms)) {
      // @ts-ignore
      platforms[key] = Math.round(value * 100) / 100
    }
    // get all autoCollect Pulses
    const autoCollectPulses = await Pulse.findAll({
      where: {
        ...where,
        ...userWhere,
        [Op.or]: [
          {
            action: "auto-collect-rejected"
          },
          {
            action: "auto-collect-accepted"
          }
        ]
      }
    })
    // get all collection Pulses
    const collectionPulses = await CollectionItem.findAll({
      where: {
        ...where,
        ...userWhere
      }
    })
    // generate hours graph
    let autoCollectHours = new HoursOfDay().hours
    for (const upload of autoCollectPulses) {
      const hour = dayjs(upload.createdAt).format("h A")
      autoCollectHours[hour] = (autoCollectHours[hour] || 0) + 1
    }
    let collectionHours = new HoursOfDay().hours

    for (const upload of collectionPulses) {
      const hour = dayjs(upload.createdAt).format("h A")
      collectionHours[hour] = (collectionHours[hour] || 0) + 1
    }
    return {
      uploadsCurrent,
      uploadsLast,
      uploadsDifference: uploadsCurrent - uploadsLast,
      reports: {},
      longestStreak: "69",
      streak: 69,
      streaks: [
        {
          count: 4154
        }
      ],
      streakBegan: "Unavailable",
      months,
      weekdays,
      pulse: {
        platforms,
        avgHours:
          Math.round(average(totalPulseHoursArray) * 100 + Number.EPSILON) /
          100,
        hours: hoursLastWeek,
        autoCollectHours,
        collectionHours,
        autoCollectRejections: autoCollectPulses.filter(
          (pulse) => pulse.action === "auto-collect-rejected"
        ).length,
        autoCollectAccepts: autoCollectPulses.filter(
          (pulse) => pulse.action === "auto-collect-accepted"
        ).length
      },
      words: wordsObject
        .sort((a, b) => (a.count > b.count ? -1 : 1))
        .slice(0, 500),
      hours,
      years
    }
  }
}
