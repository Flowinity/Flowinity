import { Service } from "typedi"
import { Announcement } from "@app/models/announcement.model"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Upload } from "@app/models/upload"

@Service()
export class CoreService {
  async getAnnouncements(): Promise<any> {
    return await Announcement.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "username", "avatar"]
        }
      ]
    })
  }

  async getStats(): Promise<any> {
    return {
      users: await User.count(),
      announcements: await Announcement.count(),
      usage: await User.sum("quota"),
      usagePercentage: (await User.sum("quota")) / 1000000000000,
      //      users: user.count,
      //       uploads: upload.count,
      //       domains: domain.count,
      //       usage: usage[0],
      //       collections,
      //       collectionItems,
      //       registrationGraph,
      //       uploadGraph,
      //       pulse: Math.round(
      //         pulses.reduce((acc, pulse) => acc + pulse.timeSpent, 0) / 3600000
      //       ),
      //       pulses: await Pulse.count(),
      //       invites,
      //       inviteMilestone: Math.ceil(invites / 20) * 20
      collections: await Collection.count(),
      collectionItems: await CollectionItem.count(),
      // TODO
      registrationGraph: null,
      uploadGraph: null,
      uploads: await Upload.count()
    }
  }
  getExperiments(): object {
    const experiments = {
      API_VERSION_V2: true,
      MEME_GEN: false,
      INSTANT_UPLOAD: true,
      USER_V2: false,
      SFX_KFX: false,
      SFX_KOLF: false,
      HOVER_CHIP_CLOSE_DELAY: 35,
      HOVER_CHIP_OPEN_DELAY: 35,
      HOVER_CHIP_HOVER: true,
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
    if (process.env.NODE_ENV === "development") {
      experiments.FORCE_DEV_MODE = true
      experiments.FORCE_STABLE_MODE = false
      experiments.USER_V2 = true
      return experiments
    } else {
      return experiments
    }
  }
}
