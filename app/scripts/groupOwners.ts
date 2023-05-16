// Import Models
import { Chat } from "@app/models/chat.model"

async function main(): Promise<void> {
  const chats: Chat[] = await Chat.findAll({})

  console.log(chats)
}

main().then((r: void): void => {
  console.log(r)
})
