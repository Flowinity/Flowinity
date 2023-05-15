import multer from "multer"
import cryptoRandomString from "crypto-random-string"
import path from "path"

const storage = multer.diskStorage({
  destination:
    require(global.appRoot + "/config/tpu.json")?.storage || "storage",
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
