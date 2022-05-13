require('dotenv').config()
import { Client, Message } from 'discord.js'
import { BATTLE_JOBS } from './static/constant'
// import { BATTLE_JOB } from './static/constant'

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"]})
const TOKEN = process.env.DISCORD_BOT_TOKEN
// type BattleJob = typeof BATTLE_JOB[keyof typeof BATTLE_JOB]
const XIVAPI = require('@xivapi/js')
const xiv = new XIVAPI()

client.on('ready', () => {
  console.log("アルファくんが起きた")
})

client.on('messageCreate', async (message: Message) => {
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

  if (message.content.match(/item/)) {
    const content = message.content.split(' ')
    const contentAry = content.splice(1, content.length)
    const itemName = contentAry.join(' ')
    console.log(itemName)
    const id = await getId(itemName)
    const msg = await getContent(id)
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

const getId = async (item: string) => {
  // item名で検索する
  let res = await xiv.search(item)
  const id: number = res.Results.length ? res.Results[0].ID : 0

  // return item ID
  return id
}

async function getContent (id: number) {
  let message: string = ''
  const CONTENT = 'item'
  await xiv.data.get(CONTENT, id).then((res: any)=> {
    if (res.GameContentLinks.GilShopItem) {
      message = res.Name_ja + '\nそのアイテムは店舗で買えるクエ！マケボ行ったらぼったくられるクエよ！！'
    } else {
      message = res.Name_ja + '\nそのアイテムは店舗で買えないクエ…マケボ行くしかないクエね…'
    }
  }).catch(() => {
    message = 'よくわかんなかったクエ…'
  })
  
  return message
}