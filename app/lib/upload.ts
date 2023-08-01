import multer from "multer"
import cryptoRandomString from "crypto-random-string"
import path from "path"

const storage: multer.StorageEngine = multer.diskStorage({
  destination: process.env.STORAGE_ROOT,
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
