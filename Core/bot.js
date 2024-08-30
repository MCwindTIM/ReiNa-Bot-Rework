const Discord = require("discord.js")
const Config = require("./config");
const Util = require("./utils");
const Events = require("./events");
const Rows = require("./rows")
const express = require('express');

//音樂依賴
const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

const { YouTubePlugin } = require("@distube/youtube")

module.exports = class ReiNaRework{
    constructor(option){
        this.config = new Config(this);
        this.webApp = express();
        this.webApp.get('/', (req,res) => {
            res.send("I'm alive!");
        })
        this.bot = new Discord.Client({ intents: [
            Discord.GatewayIntentBits.Guilds,
            Discord.GatewayIntentBits.GuildMessages,
            Discord.GatewayIntentBits.GuildMembers,
            Discord.GatewayIntentBits.GuildModeration,
            Discord.GatewayIntentBits.GuildMessageReactions,
            Discord.GatewayIntentBits.GuildVoiceStates,
            Discord.GatewayIntentBits.MessageContent
        ]});
        this.bot.distube = new DisTube(this.bot, {
            emitNewSongOnly: true,
            emitAddSongWhenCreatingQueue: false,
            emitAddListWhenCreatingQueue: false,
            plugins: [
                new SpotifyPlugin(),
                new SoundCloudPlugin(),
                new YouTubePlugin({
                    cookies: this.config.youtubeCookie
                }),
                // new YtDlpPlugin({ update: true })
            ],
        })
        
        this.util = new Util(this);
        this.events = new Events(this);
        this.rows = new Rows(this);
        this.queue = new Map();

        this.util.load(this).then((data) => {
            this.commands = data.commands;
            this.buttons = data.buttons;
            this.finishLoad = Date.now();
            this.loginTime = "";
            this.bot.login(this.config.token);
        })
        this.httpServer = this.webApp.listen(this.config.Port, () => {
            var host = this.httpServer.address().address
            var port = this.httpServer.address().port
            console.log(`📶網頁伺服器正在監聽! 訪問地址為http://${host + port}`)
        });

    }
}