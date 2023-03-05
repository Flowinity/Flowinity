import {
  Table,
  Column,
  Model,
  BelongsTo,
  AllowNull,
  DataType
} from "sequelize-typescript"
import { User } from "@app/models/user.model"

export interface InsightData {
  uploads: {
    total: {
      now: number
      previous: number
    }
    average: {
      now: number
      previous: number
    }
    hours: {
      [key: string]: number
    }
    words: {
      word: string
      count: number
    }[]
    days: {
      series: [
        {
          name: string
          data: {
            x: string
            y: number
            goals: {
              name: string
              value: number
            }[]
          }[]
        }
      ]
    }
  }
  pulses: {
    total: {
      now: number
      previous: number
    }
    average: {
      now: number
      previous: number
    }
    platforms: {
      [key: string]: number
    }
    days: {
      [key: string]: number
    }
    features: {
      name: string
      count: number
    }[]
  }
  messages: {
    total: {
      now: number
      previous: number
    }
    average: {
      now: number
      previous: number
    }
    topChats: {
      [key: string]: number
    }
  }
  workspaces: {}
  _version: number
}

@Table
export class Insight extends Model {
  @AllowNull(false)
  @Column(DataType.ENUM("weekly", "monthly", "yearly"))
  type: "weekly" | "monthly" | "yearly"

  @AllowNull(false)
  @Column(DataType.DATE)
  startDate: Date

  @AllowNull(false)
  @Column(DataType.DATE)
  endDate: Date

  @AllowNull(false)
  @Column(DataType.JSON)
  data: InsightData

  @Column
  userId: number

  @BelongsTo(() => User, "userId")
  user: User
}
