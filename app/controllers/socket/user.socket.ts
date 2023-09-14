import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  OnDisconnect,
  MessageBody,
  OnMessage
} from "socket-controllers"
import { Service } from "typedi"
import { Socket } from "socket.io"
import { SocketAuth } from "@app/types/socket"
import {
  Pulse as PulseClass,
  SinglePulse
} from "@app/classes/socket/pulse/pulse"
import { Pulse } from "@app/models/pulse.model"
import { setDominateDevice } from "@app/lib/socket"

@SocketController("/user")
@Service()
export class UserSocketController {}
