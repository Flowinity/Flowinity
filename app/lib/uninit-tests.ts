import { afterAll } from "@jest/globals"

afterAll(() => {
  db.close()
  redis.disconnect()
})
