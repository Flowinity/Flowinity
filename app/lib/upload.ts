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

const uploader = multer({
  storage
})

const uploaderSmall = multer({
  limits: { fileSize: 1048576 },
  storage
})

export default uploader
export { uploaderSmall }
