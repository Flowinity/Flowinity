import { Service } from "typedi"
// TODO: I can't get the custom fqdn for signed URLs to work on new AWS API, for now we'll use the old one.
// Disable deprecation warning
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1"
import { S3 } from "aws-sdk"
import crypto from "crypto"
import { Upload } from "@app/models/upload.model"
import fs from "fs"
import redisClient from "@app/redis"
import axios from "axios"

@Service()
export class AwsService {
  s3: S3 | null = null
  constructor() {
    if (!config.aws?.enabled) {
      return
    }
    this.s3 = new S3({
      credentials: {
        accessKeyId: config.aws.accessKeyId!,
        secretAccessKey: config.aws.secretAccessKey!
      },
      s3ForcePathStyle: true,
      endpoint: config.aws.endpoint!
    })
  }

  async uploadFile(
    files: {
      attachment: string
    }[],
    localFileMode: "delete" | "rename" | "none" = "delete"
  ): Promise<
    {
      Location: string
      Key: string
      Bucket: string
    }[]
  > {
    if (!this.s3) {
      throw new Error("AWS is not enabled")
    }

    const uploads: {
      Location: string
      Key: string
      Bucket: string
    }[] = []
    for (const file of files) {
      const path = `${global.storageRoot}/${file.attachment}`

      let fileObject: Buffer | null = await fs.promises.readFile(path)
      if (!fileObject) {
        continue
      }
      const hash = crypto.createHash("sha256")
      hash.update(fileObject)
      fileObject = null
      const key = hash.digest("hex")
      // Check if it's already uploaded onto AWS
      let exists = false
      console.log(`Checking if ${key} exists`)
      try {
        await this.s3
          .headObject({ Bucket: config.aws!.bucket!, Key: key })
          .promise()
        exists = true
      } catch {}
      console.log(`Checking if ${key} exists, ${exists}`)
      const params = {
        Bucket: config.aws!.bucket!,
        Key: key
      }
      if (!exists) {
        const upload = await this.s3.createMultipartUpload(params).promise()
        const uploadId = upload.UploadId
        const partSize = 20 * 1024 * 1024
        const fileStream = fs.createReadStream(path, {
          highWaterMark: partSize
        })

        //100MB
        let partNumber = 1
        let parts = []
        for await (const chunk of fileStream) {
          const params = {
            Body: chunk,
            Bucket: config.aws!.bucket!,
            Key: key,
            PartNumber: partNumber,
            UploadId: uploadId!
          }

          const uploadPartResponse = await this.s3.uploadPart(params).promise()
          console.log(
            `Part ${partNumber} uploaded. ETag:`,
            uploadPartResponse.ETag,
            `Max part size: ${chunk.length}`
          )

          parts.push({
            ETag: uploadPartResponse.ETag,
            PartNumber: partNumber
          })

          partNumber++
        }

        // Complete the multipart upload
        const completeParams = {
          Bucket: config.aws!.bucket!,
          Key: key,
          MultipartUpload: {
            Parts: parts
          },
          UploadId: uploadId!
        }

        const completeMultipartUploadResponse = await this.s3
          .completeMultipartUpload(completeParams)
          .promise()
        console.log(
          "Multipart upload completed:",
          completeMultipartUploadResponse.Location
        )
      }
      uploads.push({
        Location: `${config.aws!.bucketUrl}/${key}`,
        Key: key,
        Bucket: config.aws!.bucket!
      })
      await Upload.update(
        { location: config.aws!.bucket!, sha256sum: key },
        { where: { attachment: file.attachment } }
      )
      // delete file since it's now on AWS
      if (localFileMode === "delete") {
        await fs.promises.unlink(`${global.storageRoot}/${file.attachment}`)
      } else if (localFileMode === "rename") {
        await fs.promises.rename(
          `${global.storageRoot}/${file.attachment}`,
          `${global.storageRoot}/${file.attachment}.toDeleteUploadedS3TPU`
        )
      }
    }
    return uploads
  }

  async retrieveFile(key: string) {
    if (!this.s3) {
      throw new Error("AWS is not enabled")
    }
    if (fs.existsSync(`${global.storageRoot}/${key}.awscache`)) {
      return fs.promises.readFile(`${global.storageRoot}/${key}.awscache`)
    }

    const params = {
      Bucket: config.aws!.bucket!,
      Key: key
    }

    const data = await this.s3.getObject(params).promise()
    // cache it locally for an hour
    // fs.promises.writeFile(
    //   `${global.storageRoot}/${key}.awscache`,
    //   data.Body as Buffer,
    //   { flag: "w" }
    // )
    // await queue.awsCacheQueue?.add(
    //   key,
    //   {
    //     key: `${key}.awscache`
    //   },
    //   {
    //     removeOnComplete: true,
    //     removeOnFail: true,
    //     // offset of 1 hour
    //     delay: 1000 * 60 * 60
    //   }
    // )
    return data.Body
  }

  async getSignedUrl(
    key: string,
    filename: string,
    type: "attachment" | "inline" = "attachment",
    mimeType = "application/octet-stream",
    // 7 days
    expiry = 60 * 60 * 24 * 7
  ): Promise<string> {
    if (!this.s3) {
      throw new Error("AWS is not enabled")
    }
    const cacheKey = `s3SignedUrl:${key}:${filename}:${type}:${mimeType}:${expiry}`
    const cached = await redisClient.get(cacheKey)
    // if cached version is 4d old, refresh it
    if (cached && (await redisClient.ttl(cacheKey)) > 60 * 60 * 24 * 4) {
      return cached
    }
    const params = {
      Bucket: config.aws!.bucket!,
      Key: key,
      Expires: expiry,
      ResponseContentDisposition: `${type}; filename="${filename}"`,
      ResponseContentType: mimeType
    }
    let signed = await this.s3.getSignedUrlPromise("getObject", params)
    if (config.aws!.bucketUrl)
      signed = signed.replace(
        `${config.aws!.endpoint}/${config.aws!.bucket}`,
        config.aws!.bucketUrl
      )
    await redisClient.set(cacheKey, signed, {
      EX: expiry
    })
    return signed
  }

  async deleteFile(key: string): Promise<void> {
    if (!this.s3) {
      throw new Error("AWS is not enabled")
    }
    if (!key) {
      return
    }
    const uploads = await Upload.findAll({
      where: {
        sha256sum: key
      }
    })
    console.log(uploads.length)
    if (uploads.length === 0) {
      await this.s3
        .deleteObject({
          Bucket: config.aws!.bucket!,
          Key: key
        })
        .promise()
      if (config.cloudflare?.enabled) {
        // get the cached cdn links to clear from the Cloudflare cache
        const signedUrls = await redisClient
          .keys(`s3SignedUrl:${key}:*`)
          .then((keys) =>
            Promise.all(
              keys.map(async (key) => {
                return redisClient.get(key)
              })
            )
          )
        await axios
          .post(
            `https://api.cloudflare.com/client/v4/zones/${config.cloudflare.zone}/purge_cache`,
            {
              files: signedUrls
            },
            {
              headers: {
                Authorization: `Bearer ${config.cloudflare.key}`,
                "Content-Type": "application/json"
              }
            }
          )
          .catch((e) => {
            console.error(e?.response?.data)
          })
      }
      await redisClient.del(`s3SignedUrl:${key}:*`)
    }
  }
}
