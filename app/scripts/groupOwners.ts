import { Chat } from "@app/models/chat.model"
async function main() {
  const chats = await Chat.findAll({})
  console.log(chats)
}
main()
