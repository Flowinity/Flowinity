declare module "dataloader-sequelize";

import { Sequelize } from "sequelize";

export const EXPECTED_OPTIONS_KEY: string;
export function createContext(sequelize: Sequelize): any;
