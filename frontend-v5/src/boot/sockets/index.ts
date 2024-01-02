import setupMessages from "@/boot/sockets/message.socket";
import setupCollections from "@/boot/sockets/collection.socket";
import setupUser from "@/boot/sockets/user.socket";
import setupChatAssociation from "@/boot/sockets/chatAssociation.socket";

export function setupSockets() {
  setupMessages();
  setupCollections();
  setupUser();
  setupChatAssociation();
}
