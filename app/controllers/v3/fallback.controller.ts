import { All, Get, JsonController, Res } from "routing-controllers"
import { Service } from "typedi"
import { Response } from "express"
import Errors from "@app/lib/errors"

@Service()
@JsonController("")
export class FallbackControllerV3 {
  constructor() {}

  @All("/api/v3")
  async v3Home() {
    return {
      version: 3,
      message: "Welcome to TPUv3.",
      docs: "https://images.flowinity.com/api/v3/docs",
      status: 200,
      deprecationDate: null,
      removalDate: null,
      startDate: "2023-05-10T00:00:00.000Z",
      removed: false,
      deprecated: false,
      current: true
    }
  }

  @All("/api/v2")
  async v2Home() {
    return {
      version: 2,
      message:
        "TroploPrivateUploader API version 2 will be replaced by version 3, please check the relevant API documentation for v3 at /api/v3/docs.",
      docs: "https://images.flowinity.com/api/v3/docs",
      status: 200,
      deprecationDate: "2023-05-11",
      removalDate: null,
      startDate: "2023-01-26",
      removed: false,
      deprecated: true,
      current: false
    }
  }

  @All("/api/v1")
  @All("/api/v1/:path*")
  async v1Home(@Res() res: Response) {
    res.status(410)
    return {
      version: 1,
      message:
        "TroploPrivateUploader API version 1 is no longer available, please check the relevant API documentation for v3 at /api/v3/docs.",
      docs: "https://images.flowinity.com/api/v3/docs",
      status: 410,
      deprecationDate: "2023-01-26",
      removalDate: "2023-04-13",
      startDate: "2021-08-10",
      removed: true,
      deprecated: true,
      current: false
    }
  }

  @Get("/api/:path*")
  async notFound(@Res() res: Response) {
    if (!config.finishedSetup) throw Errors.NOT_SETUP
    throw Errors.NOT_FOUND
  }
}
