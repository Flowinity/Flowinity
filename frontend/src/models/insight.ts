import { User } from "./user";

export interface InsightData {
  uploads: {
    total: {
      now: number;
      previous: number;
    };
    average: {
      now: number;
      previous: number;
    };
    hours: {
      [key: string]: number;
    };
    words: {
      word: string;
      count: number;
    }[];
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
      [key: string]: number;
    };
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
}
