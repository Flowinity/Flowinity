import { Service } from "typedi"
import { AWSError, S3 } from "aws-sdk"
import crypto from "crypto"
import { Upload } from "@app/models/upload.model"
import fs from "fs"
import redisClient from "@app/redis"

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
      endpoint: config.aws.endpoint!,
      region: config.aws.region!
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
      const fileObject = await fs.promises.readFile(
        `${global.storageRoot}/${file.attachment}`
      )
      if (!fileObject) {
        continue
      }
      const hash = crypto.createHash("sha256")
      hash.update(fileObject)
      const key = hash.digest("hex")
      // Check if it's already uploaded onto AWS
      try {
        await this.s3
          .headObject({ Bucket: config.aws!.bucket!, Key: key })
          .promise()
        uploads.push({
          Location: `${config.aws!.bucketUrl}/${key}`,
          Key: key,
          Bucket: config.aws!.bucket!
        })
        continue
      } catch (e: any) {
        if (e.code !== "NotFound") {
          throw e
        }
        const params = {
          Bucket: config.aws!.bucket!,
          Key: key,
          Body: fileObject
        }
        await this.s3.upload(params).promise()
        uploads.push({
          Location: `${config.aws!.bucketUrl}/${key}`,
          Key: key,
          Bucket: config.aws!.bucket!
        })

        await Upload.update(
          { location: config.aws!.bucket! },
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
    }
    return uploads
  }

  async retrieveFile(key: string): Promise<Buffer> {
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
    return data.Body as Buffer
  }

  async getSignedUrl(
    key: string,
    filename: string,
    type: "attachment" | "inline" = "attachment"
  ): Promise<string> {
    console.log(type)
    if (!this.s3) {
      throw new Error("AWS is not enabled")
    }
    const cached = await redisClient.get(
      `s3SignedUrl:${key}:${filename}:${type}`
    )
    if (cached) {
      return cached
    }
    const params = {
      Bucket: config.aws!.bucket!,
      Key: key,
      Expires: null,
      ResponseContentDisposition: `${type}; filename="${filename}"`,
      ResponseContentType: "image/png"
    }
    const signed = await this.s3.getSignedUrlPromise("getObject", params)
    const signedFixed = signed.replace(
      `${config.aws!.bucket}/${config.aws!.bucket!}/${key}`,
      `${config.aws!.bucket}/${key}`
    )
    await redisClient.set(`s3SignedUrl:${key}:${filename}:${type}`, signedFixed)
    return signedFixed
  }

  async deleteFile(key: string): Promise<void> {
    if (!this.s3) {
      throw new Error("AWS is not enabled")
    }
    if (!key) {
      return
    }
    await this.s3
      .deleteObject({
        Bucket: config.aws!.bucket!,
        Key: key
      })
      .promise()
  }
}
