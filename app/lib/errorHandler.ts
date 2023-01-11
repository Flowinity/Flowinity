import { Request, Response, NextFunction } from "express"

const sequelize = require("../models")
const Errors = require("./errors")

export default function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof sequelize.Sequelize.ValidationError) {
    res.status(400).json({
      name: "Troplo/ErrorHandler/ValidationError",
      errors: err.errors.map((error: any) => {
        return {
          message: error.message?.replace(
            /Validation (.*?) on (.*?) failed/,
            "$2 is invalid."
          ),
          field: error.path
        }
      })
    })
  } else if (err?.name in Errors) {
    res.status(err?.status).json({
      errors: [err]
    })
  } else {
    console.error(err)
    res.status(500).json({
      errors: [Errors.unknown]
    })
  }
}
