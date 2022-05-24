import { Client, Message } from 'discord.js'
import { BATTLE_JOBS, ITEM, LODESTONE } from './static/constant'
import i18next from 'i18next'
import enJson from './static/locales/en.json'
import jaJson from './static/locales/ja.json'

// 多言語対応の設定(xivapiには常に英語で投げるためデフォルトはen)
i18next.init({
  lng: 'en',
  debug: true,
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson }
  }
})

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"]})
const TOKEN = process.env.DISCORD_BOT_TOKEN
const XIVAPI = require('@xivapi/js')
const xiv = new XIVAPI()
const Discord = require(`discord.js`)
const { google } = require('googleapis')
const customSearch = google.customsearch("v1")

// 起動時にメッセージをログ出力
client.on('ready', () => {
  console.log("アルファくんが起きた")
})

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) {
    return
  }

  // メンションに応じる
  if (client.user && message.mentions.has(client.user.id)) {
    message.reply("クエッ！")
  }

  if (message.content.match(/ジョブ/)) {
    const msg = rouletteJobs()
    sendText(message, msg)
  }

  if (message.content.match(/item/)) {
    // 検索キーワードに対して回答を送信する
    const searchWord = message.content.replace('item ', '')
    const itemId = await getItemId(i18next.t(searchWord))
    const answer = await getAnswer(itemId)
    sendText(message, answer)

    // Google検索結果の埋め込みリンクを送信する
    const searchResult = await searchGoogle(searchWord + LODESTONE)
    const embed = new Discord.MessageEmbed()
      .setTitle(searchResult.title)
      .setURL(searchResult.link)
      .addField(searchResult.snippet, searchResult.htmlFormattedUrl)
      .setThumbnail(searchResult.pagemap.cse_thumbnail[0].src)
      .setTimestamp()
    
    message.channel.send({ embeds: [embed] })
  }
})

client.login(TOKEN)


/**
 *  botのメッセージを送信する
 */
function sendText (message:Message, text: string) {
  message.channel.send(text)
}

/**
 *  ランダムにジョブ名を返す
 */
function rouletteJobs () {
  const random = Math.floor(Math.random() * BATTLE_JOBS.length)
  const msg = "今日は" + BATTLE_JOBS[random] + "で行くクエッ！！"
  return msg
}

/**
 *　検索したキーワードからアイテムのIDを取得する
 *  @param string itemName
 */
const getItemId = async (itemName: string) => {
  // item名で検索する
  let res = await xiv.search(itemName)
  const id: number = res.Results.length ? res.Results[0].ID : 0

  // return item ID
  return id
}

/**
 *　アルファくんの返答メッセージを作成する
 *  @param number id
 */
async function getAnswer (id: number) {
  // 返答用のメッセージを用意
  let message: string = ''
  // xivapiからアイテムデータを取得する
  await xiv.data.get(ITEM, id).then((res: any)=> {
    // GilShopItem内の要素の有無でメッセージを分岐する
    if (res.GameContentLinks.GilShopItem) {
      message = res.Name_ja + '\nそのアイテムは店舗で' + res.PriceMid +　'ギルで買えるクエ！マケボ行ったらぼったくられるクエよ！！'
    } else {
      message = res.Name_ja + '\nそのアイテムは店舗で買えないクエ…マケボ行くしかないクエね…'
    }
  }).catch(() => {
    // キーワードでうまく検索できなかった場合のエラーハンドリング
    message = 'よくわかんなかったクエ…'
  })
  
  return message
}

/**
 *　検索キーワードでgoogle検索APIを叩く
 *  @param string keyword
 */
async function searchGoogle(keyword: string) {
  const result = await customSearch.cse.list({
    auth: process.env.GOOGLE_API_KEY,
    cx: process.env.SEARCH_ENGINE_ID,
    q: keyword
  })

  return result.data.items[0]
}
