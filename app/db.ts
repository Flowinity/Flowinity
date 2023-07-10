import { Sequelize } from "sequelize-typescript"
import fs from "fs"
import path from "path"

let config: any = null

try {
  global.appRoot = path.resolve(__dirname).includes("out")
    ? path.join(__dirname, "..", "app")
    : path.join(__dirname)
  config = JSON.parse(
    fs.readFileSync(path.join(global.appRoot, "config", "config.json"), "utf8")
  ) as any
} catch {
  console.warn(
    "[PRIVATEUPLOADER] Your PrivateUploader instance is not configured. Please visit your instance in your browser to go through the setup wizard.\nIf you don't have a GUI, please follow the setup guide at https://docs.privateuploader.com."
  )
}

let sequelize: any = null

if (config)
  sequelize = new Sequelize({
    ...config[process.env.NODE_ENV || "development"],
    models: [__dirname + "/models"],
    modelMatch: (): boolean => {
      return true
    }
  })

export default sequelize as Sequelize
