import { Sequelize } from "sequelize-typescript"
const config = require(__dirname + "/config/config.json")[
  process.env.NODE_ENV || "development"
]
const sequelize = new Sequelize({
  ...config,
  models: [__dirname + "/models"],
  modelMatch: (filename, member) => {
    console.log(filename)
    return (
      filename.substring(0, filename.indexOf(".model")) === member.toLowerCase()
    )
  }
})
export default sequelize
