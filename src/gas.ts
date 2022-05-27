// const http = require("http")
const axios = require("axios")
import { Message } from 'discord.js'

export const sendGAS = (message: Message) => {
  const jsonData = {
    author: message.author,
    content: message.content,
    channel: message.channel
  }
  const post = async () => {
    try {
      await axios({
        method: "post",
        url: process.env.GAS_URL,
        data: jsonData,
        responseType: "json",
      }).then((res: any) => {
        const msg = res.data
        console.log(msg)
      })
    } catch (err) {
      console.log(err)
    }
  }
  post()
}

// http
//   .createServer((request: any, response: any) => {
//     console.log('Post from GAS')
//     response.send("Discord bot is active now.")
//   })
//   .litsen(3000)
