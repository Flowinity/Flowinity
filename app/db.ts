import { Sequelize } from "sequelize-typescript"
const config = require(__dirname + "/config/config.json")[
  process.env.NODE_ENV || "development"
]
const sequelize = new Sequelize({
  ...config,
  models: [__dirname + "/models"],
  modelMatch: () => {
    return true
  }
})

export default sequelize
