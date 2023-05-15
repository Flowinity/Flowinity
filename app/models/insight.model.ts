import {AllowNull, BelongsTo, Column, DataType, Model, Table} from "sequelize-typescript"
import {User} from "@app/models/user.model"
import {Streak} from "@app/services/pulse.service"

export interface SeriesGraph {
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

export interface InsightData {
  uploads: {
    streak: {
      currentStreak: Streak
      longestStreak: Streak
    }
    total: {
      now: number
      previous: number
    }
    average: {
      now: number
      previous: number
    }
    hours: SeriesGraph
    words:
      | {
      word: string
      count: number
    }[]
      | null
    months: SeriesGraph | null
    days: SeriesGraph
    years: SeriesGraph | null
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
    autoCollects: SeriesGraph | null
    collections: SeriesGraph | null
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
    } | null
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
