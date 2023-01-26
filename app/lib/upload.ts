import multer from "multer"
import cryptoRandomString from "crypto-random-string"
import path from "path"
import config from "@app/config/tpu.json"

const storage = multer.diskStorage({
  destination: config.storage,
  filename: (req, file, cb) => {
    cb(
      null,
      cryptoRandomString({ length: 12 }) + path.extname(file.originalname)
    )
  }
})

const uploader = multer({
  storage: storage
})

export default uploader
