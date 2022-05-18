"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const discord_js_1 = require("discord.js");
const constant_1 = require("./static/constant");
const client = new discord_js_1.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();
client.on('ready', () => {
    console.log("アルファくんが起きた");
});
client.on('messageCreate', async (message) => {
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
    if (message.content.match(/item/)) {
        const content = message.content.split(' ');
        const contentAry = content.splice(1, content.length);
        const itemName = contentAry.join(' ');
        console.log(itemName);
        const id = await getId(itemName);
        const msg = await getContent(id);
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
const getId = async (item) => {
    let res = await xiv.search(item);
    const id = res.Results.length ? res.Results[0].ID : 0;
    return id;
};
async function getContent(id) {
    let message = '';
    const CONTENT = 'item';
    await xiv.data.get(CONTENT, id).then((res) => {
        if (res.GameContentLinks.GilShopItem) {
            message = res.Name_ja + '\nそのアイテムは店舗で買えるクエ！マケボ行ったらぼったくられるクエよ！！';
        }
        else {
            message = res.Name_ja + '\nそのアイテムは店舗で買えないクエ…マケボ行くしかないクエね…';
        }
    }).catch(() => {
        message = 'よくわかんなかったクエ…';
    });
    return message;
}
