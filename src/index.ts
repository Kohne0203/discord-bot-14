require('dotenv').config()
import { Client, Message } from 'discord.js'
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
  const jobAry  = [
    'ナイト',
    '戦士',
    '暗黒騎士',
    'ガンブレイカー',
    '白魔導士',
    '学者',
    '占星術師',
    '賢者',
    'モンク',
    '竜騎士',
    '忍者',
    '侍',
    'リーパー',
    '吟遊詩人',
    '機工士',
    '踊り子',
    '黒魔道士',
    '召喚士',
    '赤魔道士',
    '青魔導士'
  ]
  const random = Math.floor(Math.random() * jobAry.length)
  const msg = "今日は" + jobAry[random] + "で行くクエッ！！"
  return msg
}

function sendText (message:Message, text: string) {
  message.channel.send(text)
}
