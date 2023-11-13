import multer from "multer"
import cryptoRandomString from "crypto-random-string"
import path from "path"
import os from "os"

const storage: multer.StorageEngine = multer.diskStorage({
  destination:
    process.env.NODE_ENV === "test"
      ? `${os.homedir()}/test_uploads/`
      : process.env.STORAGE_ROOT,
  filename: (req, file: Express.Multer.File, cb): void => {
    console.log(file)
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
  limits: { fileSize: 2097152 },
  storage
})

export default uploader
export { uploaderSmall }
