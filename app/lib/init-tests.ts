import dayjs from "dayjs"
import db from "@app/db"
import redis from "@app/redis"
import { authMock } from "@app/lib/auth-mock"
import isoWeek from "dayjs/plugin/isoWeek"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import io from "../lib/socket-mock"

process.env.NODE_ENV = "test"
process.env.CONFIG = JSON.stringify(require("../config/tpu.json"))
global.redis = redis
global.db = db
global.config = JSON.parse(process.env.CONFIG)
global.whitelist = []
global.authMock = authMock
dayjs.extend(isoWeek)
dayjs().isoWeek()
dayjs().isoWeekday()
dayjs().isoWeekYear()
dayjs.extend(isSameOrBefore)
global.dayjs = dayjs
io.init()
