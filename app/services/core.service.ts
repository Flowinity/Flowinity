import { Service } from "typedi"
import { Announcement } from "@app/models/announcement.model"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Upload } from "@app/models/upload.model"
import { Op } from "sequelize"
import { Pulse } from "@app/models/pulse.model"
import { HoursOfDay } from "@app/services/pulse.service"
import { Invite } from "@app/models/invite.model"
import { Experiment } from "@app/models/experiment.model"
import { Note } from "@app/models/note.model"
import { Workspace } from "@app/models/workspace.model"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import axios from "axios"
import maxmind, { CityResponse, Reader } from "maxmind"
import Errors from "@app/lib/errors"
import { Message } from "@app/models/message.model"
import { Chat } from "@app/models/chat.model"
import { ReportValidate } from "@app/validators/report"
import { Report } from "@app/models/report.model"
import { WeatherResponse } from "@app/interfaces/weather"
import { State, Stats } from "@app/types/v4/core"
import { ExperimentType } from "@app/classes/graphql/core/experiments"
import { isNumeric } from "@app/lib/isNumeric"

let city: Reader<CityResponse> | undefined

maxmind
  .open<CityResponse>(process.cwd() + "/app/lib/GeoLite2-City.mmdb")
  .then((reader) => {
    city = reader
  })

@Service()
export class CoreService {
  async report(
    tpuLink: string,
    content: string,
    email: string,
    ip: string,
    userId?: number
  ) {
    ReportValidate.parse({
      tpuLink,
      content,
      email
    })
    try {
      const tpuLinkParts = tpuLink.split("/")
      const attachment = tpuLinkParts[tpuLinkParts.length - 1]
      const upload = await Upload.findOne({
        where: {
          attachment
        }
      })
      if (!upload) {
        throw Errors.ATTACHMENT_NOT_FOUND
      }
      if (await redis.get(`report:${ip}:${upload.id}`)) {
        // return fake success to prevent spam
        return true
      }
      await Report.create({
        message: content,
        email,
        reportedByUserId: userId,
        reportedUserId: upload.userId,
        uploadId: upload.id
      })
      await redis.set(`report:${ip}:${upload.id}`, "true")
      return true
    } catch (e) {
      console.log(e)
      throw Errors.INVALID_TPU_LINK
    }
  }

  async getWeather(ip: string | undefined): Promise<WeatherResponse> {
    if (!ip) throw Errors.WEATHER_NOT_RESPONDING
    try {
      const cityResponse = await city?.get(
        config.release === "dev" ? "124.169.200.0" : ip
      )
      const location = cityResponse?.city?.names?.en
      if (!location) {
        throw Errors.WEATHER_NOT_RESPONDING
      }
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${config.weatherApiKey}&units=metric`
      )
      return {
        ...data.main,
        ...data.weather[0],
        wind_speed: data.wind.speed,
        wind_deg: data.wind.deg,
        wind_gust: data.wind.gust,
        rain_1h: data.rain?.["1h"],
        rain_3h: data.rain?.["3h"],
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        location: data.name,
        _redis: new Date().toISOString()
      }
    } catch {
      return {
        error: true,
        errors: [Errors.WEATHER_NOT_RESPONDING]
      }
    }
  }

  async getState(): Promise<Partial<State>> {
    return {
      name: config.siteName,
      release: config.release,
      hostname: config.hostname,
      hostnameWithProtocol: config.hostnameWithProtocol,
      announcements: config.finishedSetup
        ? await this.getAnnouncements()
        : undefined,
      stats: config.finishedSetup ? await this.getStats() : undefined,
      maintenance: config.maintenance,
      registrations: config.registrations,
      officialInstance: config.officialInstance,
      providers: {
        anilist: !!config.providers.anilist.key,
        lastfm: !!config.providers.lastfm.key,
        mal: !!config.providers.mal.key
      },
      termsNoteId: config.termsNoteId,
      privacyNoteId: config.privacyNoteId,
      features: config.features,
      inviteAFriend: config.inviteAFriend,
      preTrustedDomains: config.preTrustedDomains,
      hostnames: config.hostnames
    }
  }

  async getAnnouncements() {
    return await Announcement.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: [
            "id",
            "username",
            "avatar",
            "moderator",
            "administrator",
            "createdAt"
          ]
        }
      ]
    })
  }

  async convertToGraph(data: any[], type?: "pulse") {
    let result = {} as Record<string, number>
    for (let i = 7; i >= 0; i--) {
      let day = dayjs().subtract(i, "days").format("YYYY-MM-DD")
      result[day] = 0
    }
    let graphInterim = data.reduce(function (res, upload) {
      let day = dayjs(upload.createdAt).format("YYYY-MM-DD")
      if (isNaN(result[day]) || result[day] === undefined) {
        return result
      }
      if (type !== "pulse") {
        result[day]++
      } else {
        result[day] += upload.timeSpent / 1000 / 60 / 60
      }
      return result
    }, {})
    if (!data.length) {
      graphInterim = result
    }
    // if pulse graph, round to 2 decimals
    if (type === "pulse") {
      for (let key in graphInterim) {
        graphInterim[key] = Math.round(graphInterim[key] * 100) / 100
      }
    }
    return {
      data: Object.values(graphInterim),
      labels: Object.keys(graphInterim)
    }
  }

  async getStats(user?: User): Promise<Partial<Stats>> {
    const where = user ? { userId: user.id } : {}
    const uploadStats = await Upload.findAll({
      where: {
        ...where,
        createdAt: {
          [Op.gte]: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000)
        }
      }
    })

    const messageStats = await Message.findAll({
      where: {
        ...where,
        createdAt: {
          [Op.gte]: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000)
        }
      }
    })

    let pulseStats = await Pulse.findAll({
      where: {
        ...where,
        other: {
          type: "session"
        },
        createdAt: {
          [Op.gte]: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000)
        }
      }
    })

    if (!user) {
      const invites = await Invite.count({
        where: {
          registerUserId: {
            [Op.ne]: null
          }
        }
      })

      return {
        users: await User.count(),
        announcements: await Announcement.count(),
        usage: await User.sum("quota"),
        usagePercentage: (await User.sum("quota")) / 1000000000000,
        collections: await Collection.count(),
        collectionItems: await CollectionItem.count(),
        uploadGraph: await this.convertToGraph(uploadStats),
        messageGraph: await this.convertToGraph(messageStats),
        pulseGraph: await this.convertToGraph(pulseStats, "pulse"),
        uploads: await Upload.count(),
        invites,
        inviteMilestone: Math.ceil(invites / 20) * 20,
        pulse: Math.round(
          (await Pulse.sum("timeSpent", {
            where: {
              other: {
                type: "session"
              }
            }
          })) /
            1000 /
            60 /
            60
        ),
        pulses: await Pulse.count(),
        docs: await Note.count(),
        messages: await Message.count(),
        chats: await Chat.count()
      }
    } else {
      const pulses = await Pulse.findAll({
        where: {
          userId: user.id,
          other: {
            type: "session"
          }
        }
      })
      let hours = new HoursOfDay().hours
      const uploads = await Upload.findAll({
        where: {
          userId: user.id
        }
      })
      for (const upload of uploads) {
        const hour = dayjs(upload.createdAt).format("h A")
        hours[hour] = (hours[hour] || 0) + 1
      }
      return {
        uploads: await Upload.count({
          where
        }),
        uploadGraph: await this.convertToGraph(uploadStats),
        messageGraph: await this.convertToGraph(messageStats),
        pulseGraph: await this.convertToGraph(pulseStats, "pulse"),
        pulse: Math.round(
          pulses.reduce((acc, pulse) => acc + pulse.timeSpent, 0) / 3600000
        ),
        pulses: await Pulse.count({ where: { userId: user.id } }),
        usage: Number(user.quota),
        hours,
        collections: await Collection.count({ where }),
        collectionItems: await CollectionItem.count({ where }),
        messages: await Message.count({ where }),
        docs: await Note.count({
          distinct: true,
          include: [
            {
              model: WorkspaceFolder,
              as: "folder",
              required: true,
              include: [
                {
                  model: Workspace,
                  where: {
                    userId: user.id
                  },
                  required: true
                }
              ]
            }
          ]
        })
      }
    }
  }

  async getUserExperiments(
    userId: number,
    dev: boolean = false,
    gold: boolean = false,
    majorVersion: number | undefined = undefined
  ) {
    const overrides = await Experiment.findAll({
      where: {
        userId
      }
    })
    const overrideObject = overrides.reduce((acc: any, override) => {
      acc[override.dataValues.key] = JSON.parse(override.value)
      return acc
    }, {})
    return {
      ...this.getExperiments(dev, gold, majorVersion),
      ...overrideObject
    } as Record<string, boolean | number>
  }

  async getUserExperimentsV4(
    userId: number,
    dev: boolean = false,
    gold: boolean = false,
    majorVersion: number = 4
  ): Promise<ExperimentType[]> {
    const overrides = await Experiment.findAll({
      where: {
        userId
      }
    })
    const experiments = this.getExperimentsV4(dev, gold, majorVersion)
    return [
      ...experiments.map((experiment) => {
        const override = overrides.find(
          (override) => override.key === experiment.id
        )
        return {
          ...experiment,
          value:
            override?.dataValues?.value === "true"
              ? true
              : override?.dataValues?.value === "false"
                ? false
                : isNumeric(override?.dataValues?.value)
                  ? parseInt(override?.dataValues?.value)
                  : experiment.value
        }
      })
    ]
  }

  getExperiments(
    dev: boolean = false,
    gold: boolean = false,
    majorVersion: number | undefined = undefined
  ): Record<string, any> {
    const experiments = {
      FAB: false,
      ENABLE_PULSE_TAB: false,
      LEGACY_FLOWINITY_SSO: false,
      CLASSIC_MIGRATE: false,
      EXPAND_APP_BAR_IMAGE: false,
      COPY_MSG_ID: false,
      WEATHER: true,
      BREADCRUMB_SHOW_PARENT: false,
      MEET: false,
      COMMS_SUPERBAR: false,
      PROGRESSIVE_HOME: false,
      DISABLE_ANIMATIONS: false,
      PROGRESSIVE_UI: false,
      CHAT_GUIDED_WIZARD: true,
      NOTE_AI_ASSIST: false,
      NOTE_COLLAB: false,
      V5_FLOAT: true,
      IAF_NAG: config.officialInstance ? 1 : 0,
      GALLERY_INFINITE_SCROLL: false,
      DOWNLOAD_THE_APP_NAG: 1,
      ENABLE_AUTOSTART_APP_NAG: 1,
      DEBUG_FAVICON: false,
      FLOWINITY: config.officialInstance || false,
      PRIDE: false,
      THEME: 3,
      NOTIFICATION_SOUND: 2,
      RESIZABLE_SIDEBARS: false,
      // TPUv3 frontend has a broken traditional mobile navigation (sidebar), thus the experimental BottomBar component
      // in this version must be enabled to make navigation possible. This flag is unused in any other version.
      LEGACY_MOBILE_NAV: false,
      OFFICIAL_INSTANCE: config?.officialInstance || false,
      API_FALLBACK_ON_ERROR: false,
      API_VERSION: 3,
      USER_V3_EDITOR: false,
      RAIL_SIDEBAR: true,
      USER_V3_MODIFY: true,
      USER_V3: true,
      EARLY_ACCESS: false,
      PINNED_MESSAGES: true,
      COMMUNICATIONS_KEEP_LOADED: true,
      COMMUNICATIONS_INLINE_SIDEBAR_HIRES: false,
      COMMUNICATIONS_QUAD_SIDEBAR_LOWRES: false,
      COMMUNICATIONS: config?.features?.communications ?? true,
      WEBMAIL: false,
      SURVEYS: false,
      PROJECT_MERGE: true,
      WORKSPACES_SIDEBAR: true,
      LEGACY_CUSTOMIZATION: false,
      ACCOUNT_DEV_ELIGIBLE: false,
      QUICK_NOTES: false,
      INTERACTIVE_NOTES: config?.features?.workspaces ?? true,
      CREEPY_SFX_BUTTON: false,
      PROFILE_BANNER: true,
      PROJECT_CENTRAL: false,
      DESIGN_V2: false,
      API_VERSION_V2: true,
      MEME_GEN: false,
      INSTANT_UPLOAD: true,
      USER_V2: true,
      SFX_KFX: false,
      SFX_KOLF: false,
      HOVER_CHIP_CLOSE_DELAY: 35,
      HOVER_CHIP_OPEN_DELAY: 35,
      HOVER_CHIP_HOVER: true,
      EXPERIENCE_FLUID: false,
      EXPERIENCE_ITEMS_PER_PAGE: 12,
      EXPERIENCE_GALLERY_ITEM_WIDTH: 4,
      ANDROID_CONFIG: true,
      LEGACY_ATTRIBUTES_UI: false,
      meta: {
        FAB: {
          description: "Enable the global floating action button.",
          createdAt: "2024-05-18T00:00:00.000Z",
          versions: [3]
        },
        ENABLE_PULSE_TAB: {
          description: "Enable Insights Pulse tab.",
          createdAt: "2024-05-18T00:00:00.000Z",
          versions: [2]
        },
        LEGACY_FLOWINITY_SSO: {
          description: "Enable legacy Flowinity SSO.",
          createdAt: "2024-05-18T00:00:00.000Z",
          versions: [1, 2]
        },
        CLASSIC_MIGRATE: {
          description: "Enable classic migration.",
          createdAt: "2024-05-18T00:00:00.000Z",
          versions: [3]
        },
        EXPAND_APP_BAR_IMAGE: {
          description: "Expand app bar image on scroll up.",
          createdAt: "2024-05-15T00:00:00.000Z",
          versions: [4, 5]
        },
        COPY_MSG_ID: {
          description: "Copy message ID to clipboard via MessageActions.",
          createdAt: "2024-05-15T00:00:00.000Z",
          versions: [4, 5]
        },
        WEATHER: {
          description: "Enable weather in New and Old UI.",
          createdAt: "2024-05-14T00:00:00.000Z",
          versions: [4, 5]
        },
        BREADCRUMB_SHOW_PARENT: {
          description: "Show parent railbar item in breadcrumb.",
          createdAt: "2024-05-14T00:00:00.000Z",
          versions: [4, 5]
        },
        MEET: {
          description: "Enable Flowinity Meet.",
          createdAt: "2024-05-13T00:00:00.000Z",
          versions: [4, 5]
        },
        COMMS_SUPERBAR: {
          description: "Enable communications in superbar.",
          createdAt: "2024-05-12T00:00:00.000Z",
          versions: [4, 5]
        },
        PROGRESSIVE_HOME: {
          description: "Enable redesigned homepage with Progressive UI.",
          createdAt: "2024-05-12T00:00:00.000Z",
          versions: [4]
        },
        DISABLE_ANIMATIONS: {
          description: "Disable Progressive UI animations.",
          createdAt: "2024-05-11T00:00:00.000Z",
          versions: [4]
        },
        PROGRESSIVE_UI: {
          description: "TPUv4 overhaul project",
          createdAt: "2024-05-09T00:00:00.000Z",
          versions: [4]
        },
        CHAT_GUIDED_WIZARD: {
          description: "Enable guided wizard for chat join and create",
          createdAt: "2024-05-03T00:00:00.000Z",
          versions: [4]
        },
        NOTE_AI_ASSIST: {
          description: "Enable AI assistance in notes",
          createdAt: "2024-04-27T00:00:00.000Z",
          versions: [4]
        },
        NOTE_COLLAB: {
          description: "Enable note collaboration",
          createdAt: "2024-04-26T00:00:00.000Z",
          versions: [4]
        },
        V5_FLOAT: {
          description: "Enable V5 floating UI",
          createdAt: "2024-04-01T00:00:00.000Z",
          versions: [5]
        },
        IAF_NAG: {
          description:
            "Show the Invite a Friend nag. 0 for disabled, 1 for enabled on verified users, 2 for everyone, 3 is disabled with positive interaction. 4 is disabled with redeemed. 5 is disabled with negative interaction",
          createdAt: "2024-03-11T00:00:00.000Z",
          versions: [4]
        },
        GALLERY_INFINITE_SCROLL: {
          description:
            "Enable next generation gallery experience. Includes drag-to-select and infinite scrolling.",
          createdAt: "2024-03-11T00:00:00.000Z",
          versions: [4]
        },
        DOWNLOAD_THE_APP_NAG: {
          description:
            "Show the download the app nag. 0 for disabled, 1 for verified users, 2 for everyone, 3 for disabled with nag interaction.",
          createdAt: "2024-03-03T00:00:00.000Z",
          versions: [4]
        },
        ENABLE_AUTOSTART_APP_NAG: {
          description:
            "Enable autostart app nag. 0 for disabled, 1 for enabled, 2 for disabled with nag interaction.",
          createdAt: "2024-03-03T00:00:00.000Z",
          versions: [4]
        },
        DEBUG_FAVICON: {
          description: "Enable debug favicon.",
          createdAt: "2024-01-20T00:00:00.000Z",
          versions: [4, 5]
        },
        FLOWINITY: {
          description: "Rebrand PrivateUploader to Flowinity.",
          createdAt: "2024-01-17T00:00:00.000Z",
          versions: [4]
        },
        PRIDE: {
          description: "Enable pride theme.",
          createdAt: "2023-11-08T00:00:00.000Z",
          versions: [3, 4, 5]
        },
        THEME: {
          description:
            "What frontend theme is applied. 1 is light, 2 is dark, 3 is amoled.",
          createdAt: "2023-09-24T00:00:00.000Z",
          versions: [3, 4, 5]
        },
        NOTIFICATION_SOUND: {
          description:
            "What sound plays when a notification is received. 1 is default, 2 is classic.",
          createdAt: "2023-09-24T00:00:00.000Z",
          versions: [3, 4, 5]
        },
        RESIZABLE_SIDEBARS: {
          description:
            "Enable resizing functionality in the TPU Sidebar component",
          createdAt: "2023-09-16T00:00:00.000Z",
          versions: [3, 4]
        },
        LEGACY_MOBILE_NAV: {
          description: "Legacy mobile navigation.",
          createdAt: "2023-06-16T00:00:00.000Z",
          versions: [3]
        },
        OFFICIAL_INSTANCE: {
          description: "Official PrivateUploader instance.",
          createdAt: "2023-05-15T00:00:00.000Z",
          versions: [2, 3, 4, 5]
        },
        API_FALLBACK_ON_ERROR: {
          description: "If the API request fails, fallback to the old API.",
          createdAt: "2023-05-10T00:00:00.000Z",
          versions: [1, 2]
        },
        API_VERSION: {
          description: "Specify custom API version.",
          createdAt: "2023-05-10T00:00:00.000Z",
          versions: [1, 2, 3, 4]
        },
        USER_V3_EDITOR: {
          description: "Development JSON editor and buttons for UserV3.",
          createdAt: "2023-05-09T00:00:00.000Z",
          versions: [3, 4]
        },
        RAIL_SIDEBAR: {
          description: "Enable the new sidebar.",
          createdAt: "2023-05-07T00:00:00.000Z",
          versions: [3, 4]
        },
        USER_V3_MODIFY: {
          description: "Edit your own UserV3 profile.",
          createdAt: "2023-05-05T00:00:00.000Z",
          versions: [3, 4, 5]
        },
        USER_V3: {
          description:
            "Enable the new Profiles update with user customizable components and widgets with various off-platform integrations.",
          createdAt: "2023-04-30T00:00:00.000Z",
          versions: [3, 4, 5]
        },
        EARLY_ACCESS: {
          description:
            "Enable generic early access features that don't have special experiment overrides.",
          createdAt: "2023-03-08T00:00:00.000Z",
          versions: [3, 4, 5]
        },
        PINNED_MESSAGES: {
          description: "Enable pinned messages in Communications.",
          createdAt: "2023-03-07T00:00:00.000Z",
          versions: [3, 4, 5]
        },
        COMMUNICATIONS_KEEP_LOADED: {
          description: "Keep communication messages loaded in the store.",
          createdAt: "2023-03-02T00:00:00.000Z",
          versions: [3, 4, 5]
        },
        COMMUNICATIONS_INLINE_SIDEBAR_HIRES: {
          description:
            "Enable inline sidebar for communications on high resolution devices.",
          createdAt: "2023-02-18T00:00:00.000Z",
          versions: [3]
        },
        COMMUNICATIONS_QUAD_SIDEBAR_LOWRES: {
          description:
            "Enable quad sidebar for communications on low resolution devices (not inline).",
          createdAt: "2023-02-18T00:00:00.000Z",
          versions: [3]
        },
        COMMUNICATIONS: {
          description: "Enable TPU Communications.",
          createdAt: "2023-02-10T00:00:00.000Z",
          versions: [3, 4, 5]
        },
        WEBMAIL: {
          description: "Enable TPU webmail.",
          createdAt: "2023-02-10T00:00:00.000Z",
          versions: [3, 4, 5]
        },
        SURVEYS: {
          description: "Allow the ability to create surveys.",
          createdAt: "2023-02-10T00:00:00.000Z",
          versions: [3, 4, 5]
        },
        PROJECT_MERGE: {
          description:
            "TPU Central concept for bringing Colubrina, BetterCompass, Jitsi, and GeoGuess together in one centralized platform.",
          createdAt: "2023-02-09T00:00:00.000Z",
          versions: [2, 3, 4]
        },
        WORKSPACES_SIDEBAR: {
          description: "Enable the new separate workspaces sidebar",
          createdAt: "2023-02-08T00:00:00.000Z",
          versions: [2, 3, 4]
        },
        LEGACY_CUSTOMIZATION: {
          description:
            "Re-enable legacy meta tag customization for TPUv1. This is no longer in TPUv2.",
          createdAt: "2023-02-07T00:00:00.000Z",
          versions: [1, 2]
        },
        ACCOUNT_DEV_ELIGIBLE: {
          description:
            "This toggle does nothing, it simply tells whether your account is eligible for development features based on inherit value.",
          createdAt: "2023-02-04T00:00:00.000Z",
          versions: [1, 2, 3, 4, 5]
        },
        QUICK_NOTES: {
          description: "Allow the ability to create quick notes.",
          createdAt: "2023-02-04T00:00:00.000Z",
          versions: [2]
        },
        INTERACTIVE_NOTES: {
          description:
            "Allow the ability to view and create interactive TPU notes.",
          createdAt: "2023-01-31T00:00:00.000Z",
          versions: [2, 3, 4, 5]
        },
        CREEPY_SFX_BUTTON: {
          description: "Allow the ability to send creepy sfx's to friends.",
          createdAt: "2023-01-28T00:00:00.000Z",
          versions: [2]
        },
        PROFILE_BANNER: {
          description: "Can change UserV2 banner.",
          createdAt: "2023-01-28T00:00:00.000Z",
          versions: [2]
        },
        PROJECT_CENTRAL: {
          description:
            "Have the TPU instance think it's running in a Central environment.",
          createdAt: "2023-01-23T00:00:00.000Z",
          refresh: true,
          versions: [2]
        },
        DESIGN_V2: {
          description: "Use the v2 design language.",
          createdAt: "2023-01-23T00:00:00.000Z",
          refresh: true,
          versions: [1, 2]
        },
        API_VERSION_V2: {
          description:
            "Use the new TypeScript rewritten API for TPU (incomplete)",
          createdAt: "2023-01-11T00:00:00.000Z",
          refresh: true,
          versions: [1, 2]
        },
        MEME_GEN: {
          description: "Add overlay text to existing images.",
          createdAt: "2023-01-10T00:00:00.000Z",
          versions: [1, 2, 4, 5]
        },
        AUG_2021_UI: {
          description: "Re-enable Initial TPU UI.",
          createdAt: "2023-01-05T00:00:00.000Z",
          refresh: true,
          versions: [1]
        },
        NON_TPU_BRANDING: {
          description: "Re-enables the pre-TPU branding.",
          createdAt: "2023-01-05T00:00:00.000Z",
          refresh: true,
          versions: [1]
        },
        INSTANT_UPLOAD: {
          description:
            "Allow you to paste files into TPU from anywhere to instantly upload it and copy TPU link to the clipboard.",
          createdAt: "2023-01-05T00:00:00.000Z",
          versions: [1, 2, 3, 4, 5]
        },
        USER_V2: {
          description: "A redesigned user page experience.",
          createdAt: "2022-12-15T00:00:00.000Z",
          versions: [1, 2, 3]
        },
        SFX_KFX: {
          description: "A sound effect for AutoCollect triggers.",
          createdAt: "2022-12-15T00:00:00.000Z",
          versions: [1, 2]
        },
        SFX_KOLF: {
          description: "A sound effect for AutoCollect triggers.",
          createdAt: "2022-12-15T00:00:00.000Z",
          versions: [1, 2]
        },
        HOVER_CHIP_CLOSE_DELAY: {
          description: "The delay before the hover chip component closes.",
          createdAt: "2022-12-15T00:00:00.000Z",
          versions: [1, 2]
        },
        HOVER_CHIP_OPEN_DELAY: {
          description: "The delay before the hover chip component opens.",
          createdAt: "2022-12-15T00:00:00.000Z",
          versions: [1, 2]
        },
        HOVER_CHIP_HOVER: {
          description:
            "Whether the hover chip component is always expanded or expand on hover.",
          createdAt: "2022-12-15T00:00:00.000Z",
          versions: [1, 2]
        },
        EXPERIENCE_FLUID: {
          description:
            "Whether the gallery, and other pages are fluid on low resolution displays.",
          createdAt: "2022-12-15T00:00:00.000Z",
          versions: [1, 2]
        },
        EXPERIENCE_ITEMS_PER_PAGE: {
          description: "The number of items per page in the gallery.",
          createdAt: "2022-12-15T00:00:00.000Z",
          versions: [1, 2]
        },
        EXPERIENCE_GALLERY_ITEM_WIDTH: {
          description: "The width of the gallery item in the gallery.",
          createdAt: "2022-12-15T00:00:00.000Z",
          versions: [1, 2]
        },
        ANDROID_CONFIG: {
          description:
            "Ability to download Automate configuration files in Client Settings.",
          createdAt: "2022-12-15T00:00:00.000Z",
          versions: [1, 2]
        },
        EXPERIENCE_API_KEY_LOGIN: {
          description: "Ability to login with an API key on login page.",
          createdAt: "2022-12-15T00:00:00.000Z",
          versions: [1, 2]
        },
        LEGACY_ATTRIBUTES_UI: {
          description:
            "Whether the legacy attributes UI in Settings > About is enabled.",
          createdAt: "2022-12-15T00:00:00.000Z",
          versions: [1, 2]
        }
      }
    }
    if (dev || config.release === "dev") {
      experiments.PROGRESSIVE_UI = true
      experiments.CHAT_GUIDED_WIZARD = true
      experiments.NOTE_COLLAB = true
      //experiments.FORCE_DEV_MODE = false
      //experiments.FORCE_STABLE_MODE = false
      //experiments.USER_V3_EDITOR = true
      experiments.DEBUG_FAVICON = true
      experiments.FLOWINITY = true
      experiments.ACCOUNT_DEV_ELIGIBLE = true
      experiments.SURVEYS = true
      experiments.WEBMAIL = true
      experiments.EARLY_ACCESS = true
    } else if (gold) {
      experiments.EARLY_ACCESS = true
    }

    // only return experiments that are available for the major version
    if (majorVersion) {
      for (const key in experiments) {
        if (key === "meta") continue
        if (
          experiments.meta[
            key as keyof typeof experiments.meta
          ].versions?.includes(majorVersion)
        ) {
          continue
        }
        delete experiments[key as keyof typeof experiments]
        delete experiments.meta[key as keyof typeof experiments.meta]
      }
    }

    return experiments
  }

  getExperimentsV4(
    dev: boolean = false,
    gold: boolean = false,
    majorVersion: number = 4
  ): ExperimentType[] {
    const experiments = this.getExperiments(dev, gold, majorVersion)
    // remove meta from object.entries
    return Object.entries(experiments)
      .filter((experiment) => {
        return experiment[0] !== "meta"
      })
      .map(([key, value]) => ({
        id: key,
        value,
        ...experiments.meta[key]
      }))
  }

  async checkExperiment(
    userId: number,
    experiment: string,
    dev: boolean = false,
    gold: boolean = false
  ) {
    const experiments = await this.getUserExperiments(userId, dev, gold)
    return experiments[experiment]
  }

  async setExperiment(userId: number, key: string, value: boolean | number) {
    const experiment = await Experiment.findOne({
      where: {
        userId,
        key
      }
    })
    if (experiment) {
      await experiment.update({
        value
      })
      return experiment
    } else {
      return await Experiment.create({
        userId,
        key,
        value
      })
    }
  }
}
