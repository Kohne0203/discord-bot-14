require('dotenv').config()
import { Client, Message } from 'discord.js'
import { BATTLE_JOBS } from './static/constant'
// import { BATTLE_JOB } from './static/constant'

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"]})
const TOKEN = process.env.DISCORD_BOT_TOKEN
// type BattleJob = typeof BATTLE_JOB[keyof typeof BATTLE_JOB]

client.on('ready', () => {
  console.log("アルファくんが起きた")
})

client.on('messageCreate', (message: Message) => {
  if (message.author.bot) {
    return
  }
  if (message.content === "テスト") {
    sendText(message,"てすてす")
  }
  if (client.user && message.mentions.has(client.user.id)) {
    message.reply("クエッ！")
  }

  if (message.content.match(/ジョブ/)) {
    const msg = rouletteJobs()
    sendText(message, msg)
  }
})

client.login(TOKEN)

function rouletteJobs () {
  const random = Math.floor(Math.random() * BATTLE_JOBS.length)
  const msg = "今日は" + BATTLE_JOBS[random] + "で行くクエッ！！"
  return msg
}

function sendText (message:Message, text: string) {
  message.channel.send(text)
}
