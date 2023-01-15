import multer from "multer"
import cryptoRandomString from "crypto-random-string"
import path from "path"

const storage = multer.diskStorage({
  destination: "storage",
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
