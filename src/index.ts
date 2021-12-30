require('dotenv').config()
import { Client, Message } from 'discord.js'

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"]})
const TOKEN = process.env.DISCORD_BOT_TOKEN

client.on('ready', () => {
  console.log("アルファくんが起きた")
})

client.on('messageCreate', (message: Message) => {
  if (message.author.bot) {
    return
  }
  if (message.content === "テスト") {
    message.channel.send("てすてす")
  }
  if (client.user && message.mentions.has(client.user.id)) {
    message.reply("クエッ！")
  }
})

client.login(TOKEN)
