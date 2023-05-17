import { Server } from "@app/server"
import { Container } from "typedi"
async function init() {
  Container.get(Server).init()
}

export default init
