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

@Service()
export class CoreService {
  async getState(): Promise<object> {
    return {
      name: config.siteName,
      release: config.release,
      route: null,
      loading: false,
      matomoId: null,
      hostname: config.hostname,
      hostnameWithProtocol: config.hostnameWithProtocol,
      announcements: await this.getAnnouncements(),
      flowinityId: config.flowinityId,
      stats: await this.getStats(),
      maintenance: config.maintenance
    }
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return await Announcement.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "username", "avatar", "moderator", "administrator"]
        }
      ]
    })
  }

  async getStats(user?: User): Promise<object> {
    let resultUploads = {}
    const where = user ? { userId: user.id } : {}
    const uploadStats = await Upload.findAll({
      where: {
        ...where,
        createdAt: {
          [Op.gte]: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })

    for (let i = 7; i >= 0; i--) {
      let day = dayjs().subtract(i, "days").format("YYYY-MM-DD")
      resultUploads[day] = 0
    }
    let uploadGraphInterim = uploadStats.reduce(function (result, upload) {
      let day = dayjs(upload.createdAt).format("YYYY-MM-DD")
      if (!resultUploads[day]) {
        resultUploads[day] = 0
      }
      resultUploads[day]++
      return resultUploads
    }, {})
    if (!uploadStats.length) {
      uploadGraphInterim = resultUploads
    }
    let uploadGraph = {
      data: Object.values(uploadGraphInterim),
      labels: Object.keys(uploadGraphInterim)
    }
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
        uploadGraph,
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
        pulses: await Pulse.count()
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
        uploadGraph,
        pulse: Math.round(
          pulses.reduce((acc, pulse) => acc + pulse.timeSpent, 0) / 3600000
        ),
        pulses: await Pulse.count({ where: { userId: user.id } }),
        usage: user.quota,
        hours,
        collections: await Collection.count({ where }),
        collectionItems: await CollectionItem.count({ where })
      }
    }
  }

  async getUserExperiments(userId: number, dev: boolean = false) {
    const overrides = await Experiment.findAll({
      where: {
        userId
      }
    })
    return {
      ...this.getExperiments(dev),
      ...overrides.map((override) => ({
        [override.dataValues.key]: JSON.parse(override.value)
      }))[0]
    }
  }

  getExperiments(dev: boolean = false): object {
    const experiments = {
      WEBMAIL: false,
      GEOGUESS: false,
      OBJECTIVE: false,
      COMPASS_INTEGRATION: false,
      SURVEYS: false,
      PROJECT_MERGE: false,
      WORKSPACES_SIDEBAR: true,
      LEGACY_CUSTOMIZATION: false,
      ACCOUNT_DEV_ELIGIBLE: false,
      QUICK_NOTES: false,
      INTERACTIVE_NOTES: true,
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
      HOVER_CHIP_HOVER: false,
      PULSE_INTERVAL: 5000,
      PULSE_ENABLED: true,
      EXPERIENCE_FLUID: false,
      EXPERIENCE_ITEMS_PER_PAGE: 12,
      EXPERIENCE_GALLERY_ITEM_WIDTH: 4,
      ANALYTICS: true,
      ANDROID_CONFIG: true,
      EXPERIENCE_API_KEY_LOGIN: false,
      LEGACY_ATTRIBUTES_UI: false,
      LEGACY_FLOWINITY_SSO: false,
      FORCE_DEV_MODE: false,
      FORCE_STABLE_MODE: false,
      NON_TPU_BRANDING: false,
      AUG_2021_UI: false,
      meta: {
        WEBMAIL: {
          description: "Enable TPU webmail.",
          createdAt: "2023-02-10T00:00:00.000Z"
        },
        GEOGUESS: {
          description: "Enable embedded GeoGuess.",
          createdAt: "2021-02-10T00:00:00.000Z"
        },
        OBJECTIVE: {
          description: `Objective Jitsi room information, right inside TPU.`,
          createdAt: "2023-02-10T00:00:00.000Z"
        },
        COMPASS_INTEGRATION: {
          description:
            "Submit Learning Tasks via TPUDocs to JDLF, view schedule & class information.\nLink Compass account.",
          createdAt: "2023-02-10T00:00:00.000Z"
        },
        SURVEYS: {
          description: "Allow the ability to create surveys.",
          createdAt: "2023-02-10T00:00:00.000Z"
        },
        PROJECT_MERGE: {
          description:
            "TPU Central concept for bringing Colubrina, BetterCompass, Jitsi, and GeoGuess together in one centralized platform.",
          createdAt: "2023-02-09T00:00:00.000Z"
        },
        WORKSPACES_SIDEBAR: {
          description: "Enable the new separate workspaces sidebar",
          createdAt: "2023-02-08T00:00:00.000Z"
        },
        LEGACY_CUSTOMIZATION: {
          description:
            "Re-enable legacy meta tag customization for TPUv1. This is no longer in TPUv2.",
          createdAt: "2023-02-07T00:00:00.000Z"
        },
        ACCOUNT_DEV_ELIGIBLE: {
          description:
            "This toggle does nothing, it simply tells whether your account is eligible for development features based on inherit value.",
          createdAt: "2023-02-04T00:00:00.000Z"
        },
        QUICK_NOTES: {
          description: "Allow the ability to create quick notes.",
          createdAt: "2023-02-04T00:00:00.000Z"
        },
        INTERACTIVE_NOTES: {
          description:
            "Allow the ability to view and create interactive TPU notes.",
          createdAt: "2023-01-31T00:00:00.000Z"
        },
        CREEPY_SFX_BUTTON: {
          description: "Allow the ability to send creepy sfx's to friends.",
          createdAt: "2023-01-28T00:00:00.000Z"
        },
        PROFILE_BANNER: {
          description: "Can change UserV2 banner.",
          createdAt: "2023-01-28T00:00:00.000Z"
        },
        PROJECT_CENTRAL: {
          description:
            "Have the TPU instance think it's running in a Central environment.",
          createdAt: "2023-01-23T00:00:00.000Z",
          refresh: true
        },
        DESIGN_V2: {
          description: "Use the v2 design language.",
          createdAt: "2023-01-23T00:00:00.000Z",
          refresh: true
        },
        API_VERSION_V2: {
          description:
            "Use the new TypeScript rewritten API for TPU (incomplete)",
          createdAt: "2023-01-11T00:00:00.000Z",
          refresh: true
        },
        MEME_GEN: {
          description: "Add overlay text to existing images.",
          createdAt: "2023-01-10T00:00:00.000Z"
        },
        AUG_2021_UI: {
          description: "Re-enable Initial TPU UI.",
          createdAt: "2023-01-05T00:00:00.000Z",
          refresh: true
        },
        NON_TPU_BRANDING: {
          description: "Re-enables the pre-TPU branding.",
          createdAt: "2023-01-05T00:00:00.000Z",
          refresh: true
        },
        INSTANT_UPLOAD: {
          description:
            "Allow you to paste files into TPU from anywhere to instantly upload it and copy TPU link to the clipboard.",
          createdAt: "2023-01-05T00:00:00.000Z"
        },
        USER_V2: {
          description: "A redesigned user page experience.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        SFX_KFX: {
          description: "A sound effect for AutoCollect triggers.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        SFX_KOLF: {
          description: "A sound effect for AutoCollect triggers.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        HOVER_CHIP_CLOSE_DELAY: {
          description: "The delay before the hover chip component closes.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        HOVER_CHIP_OPEN_DELAY: {
          description: "The delay before the hover chip component opens.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        HOVER_CHIP_HOVER: {
          description:
            "Whether the hover chip component is always expanded or expand on hover.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        PULSE_INTERVAL: {
          description: "The interval at which TPU Pulse Analytics will pulse.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        PULSE_ENABLED: {
          description: "Whether TPU Pulse Analytics is enabled.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        EXPERIENCE_FLUID: {
          description:
            "Whether the gallery, and other pages are fluid on low resolution displays.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        EXPERIENCE_ITEMS_PER_PAGE: {
          description: "The number of items per page in the gallery.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        EXPERIENCE_GALLERY_ITEM_WIDTH: {
          description: "The width of the gallery item in the gallery.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        ANALYTICS: {
          description: "Whether TPU Legacy Analytics are enabled.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        ANDROID_CONFIG: {
          description:
            "Ability to download Automate configuration files in Client Settings.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        EXPERIENCE_API_KEY_LOGIN: {
          description: "Ability to login with an API key on login page.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        LEGACY_ATTRIBUTES_UI: {
          description:
            "Whether the legacy attributes UI in Settings > About is enabled.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        LEGACY_FLOWINITY_SSO: {
          description:
            "Re-enable the ability to login, and link a Flowinity SSO account.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        FORCE_DEV_MODE: {
          description: "Force TPU to run in dev mode.",
          createdAt: "2022-12-15T00:00:00.000Z"
        },
        FORCE_STABLE_MODE: {
          description: "Force TPU to run in stable mode.",
          createdAt: "2022-12-15T00:00:00.000Z"
        }
      }
    }
    if (dev) {
      //experiments.FORCE_DEV_MODE = false
      //experiments.FORCE_STABLE_MODE = false
      experiments.USER_V2 = true
      experiments.INTERACTIVE_NOTES = true
      experiments.QUICK_NOTES = true
      experiments.ACCOUNT_DEV_ELIGIBLE = true
      experiments.WORKSPACES_SIDEBAR = true
      experiments.PROJECT_MERGE = true
      experiments.SURVEYS = true
      experiments.COMPASS_INTEGRATION = true
      experiments.OBJECTIVE = true
      return experiments
    } else {
      return experiments
    }
  }
}
