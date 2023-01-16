import multer from "multer"
import cryptoRandomString from "crypto-random-string"
import path from "path"
import config from "@app/config/tpu.json"

const storage = multer.diskStorage({
  destination: config.storage,
  filename: (req, file, cb) => {
    console.log(file)
    // path.extname = file extension
    cb(
      null,
      cryptoRandomString({ length: 12 }) + path.extname(file.originalname)
    )
  }
})

const uploader = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    cb(null, true)
  }
})

export default uploader
