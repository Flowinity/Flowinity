import multer from "multer"
import cryptoRandomString from "crypto-random-string"
import path from "path"

const storage: multer.StorageEngine = multer.diskStorage({
  destination:
    require(global.appRoot + "/config/tpu.json")?.storage || "storage",
  filename: (req, file: Express.Multer.File, cb): void => {
    cb(
      null,
      cryptoRandomString({ length: 12 }) + path.extname(file.originalname)
    )
  }
})

const uploader: multer.Multer = multer({
  storage: storage
})

export default uploader
