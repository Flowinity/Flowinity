import {User} from "./user"

export interface Streak {
  startDate: string;
  endDate: string;
  length: number;
}

export interface SeriesGraph {
  series: [
    {
      name: string;
      data: {
        x: string;
        y: number;
        goals: {
          name: string;
          value: number;
        }[];
      }[];
    }
  ];
}

export interface InsightData {
  uploads: {
    streak: {
      currentStreak: Streak;
      longestStreak: Streak;
      previous?: {
        currentStreak: Streak;
        longestStreak: Streak;
      };
    };
    total: {
      now: number;
      previous: number;
    };
    average: {
      now: number;
      previous: number;
    };
    hours: SeriesGraph;
    words: {
      word: string;
      count: number;
    }[];
    months: SeriesGraph | null;
    days: SeriesGraph;
    years: SeriesGraph;
  };
  pulses: {
    total: {
      now: number;
      previous: number;
    };
    average: {
      now: number;
      previous: number;
    };
    platforms: {
      [key: string]: number;
    };
    days: {
      [key: string]: number;
    };
    features: {
      name: string;
      count: number;
    }[];
    autoCollects: SeriesGraph;
    collections: SeriesGraph;
  };
  messages: {
    total: {
      now: number;
      previous: number;
    };
    average: {
      now: number;
      previous: number;
    };
    topChats: {
      chatName: string;
      count: number;
    }[];
  };
  workspaces: {};
  _version: number;
}

export interface Insight {
  type: "weekly" | "monthly" | "yearly";
  startDate: Date;
  endDate: Date;
  data: InsightData;
  userId: number;
  user: User;
  id: number;
}
