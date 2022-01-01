"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const discord_js_1 = require("discord.js");
const constant_1 = require("./static/constant");
const client = new discord_js_1.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const TOKEN = process.env.DISCORD_BOT_TOKEN;
client.on('ready', () => {
    console.log("アルファくんが起きた");
});
client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }
    if (message.content === "テスト") {
        sendText(message, "てすてす");
    }
    if (client.user && message.mentions.has(client.user.id)) {
        message.reply("クエッ！");
    }
    if (message.content.match(/ジョブ/)) {
        const msg = rouletteJobs();
        sendText(message, msg);
    }
});
client.login(TOKEN);
function rouletteJobs() {
    const random = Math.floor(Math.random() * constant_1.BATTLE_JOBS.length);
    const msg = "今日は" + constant_1.BATTLE_JOBS[random] + "で行くクエッ！！";
    return msg;
}
function sendText(message, text) {
    message.channel.send(text);
}
