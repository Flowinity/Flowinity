import { type Socket } from "socket.io-client";
import { io } from "socket.io-client";

// function createSocket(namespace: string) {
//
//   console.log(`[TPU/Socket] Connecting to ${namespace}`);
//   const socket = io(`/${namespace}`, {
//     auth: {
//       token: localStorage.getItem("token")
//     },
//     transports: ["websocket"],
//     reconnection: true,
//     path: "/gateway",
//     reconnectionAttempts: 99999,
//     query: {
//       version: 5
//     }
//   });
//   socket.on("connect", () => {
//     console.log(`[TPU/Socket] Connected to ${namespace}`);
//   });
//   socket.on("disconnect", () => {
//     console.log(`[TPU/Socket] Disconnected from ${namespace}`);
//   });
//   return socket;
// }
//
// class SocketService {
//   chat: Socket;
//   friends: Socket;
//   mail: Socket;
//   user: Socket;
//   pulse: Socket;
//   gallery: Socket;
//   autoCollects: Socket;
//   trackedUsers: Socket;
//   core: Socket;
//   constructor() {
//     this.chat = createSocket("chat");
//     this.friends = createSocket("friends");
//     this.mail = createSocket("mail");
//     this.user = createSocket("user");
//     this.pulse = createSocket("pulse");
//     this.gallery = createSocket("gallery");
//     this.autoCollects = createSocket("autoCollects");
//     this.trackedUsers = createSocket("trackedUsers");
//     this.core = createSocket("");
//   }
// }
//
// /**
//  * @deprecated Use GraphQL subscriptions instead if available.
//  */
// export const useSocket = new SocketService();

const emulatedSocket = {
  on: () => {
    console.warn("emulatedSocket.on");
  },
  emit: () => {
    console.warn("emulatedSocket.emit");
  },
  off: () => {
    console.warn("emulatedSocket.off");
  },
  connected: false
};

/**
 * @deprecated Use GraphQL subscriptions instead. This no longer does anything.
 */
export const useSocket = {
  core: emulatedSocket,
  chat: emulatedSocket,
  friends: emulatedSocket,
  mail: emulatedSocket,
  user: emulatedSocket,
  pulse: emulatedSocket,
  gallery: emulatedSocket,
  autoCollects: emulatedSocket,
  trackedUsers: emulatedSocket
};
