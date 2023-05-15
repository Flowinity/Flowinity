/**
 * plugins/dayjs.ts
 */

import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(advancedFormat)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
export default dayjs
