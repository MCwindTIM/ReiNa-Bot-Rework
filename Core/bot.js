const Discord = require("discord.js")
const Config = require("./config");
const Util = require("./utils");
const Events = require("./events");
const Rows = require("./rows")

//音樂依賴
const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

module.exports = class ReiNaRework{
    constructor(option){
        this.bot = new Discord.Client({ intents: [
            Discord.GatewayIntentBits.Guilds,
            Discord.GatewayIntentBits.GuildMessages,
            Discord.GatewayIntentBits.GuildVoiceStates,
            Discord.GatewayIntentBits.MessageContent
        ]});
        this.bot.distube = new DisTube(this.bot, {
            leaveOnStop: false,
            emitNewSongOnly: true,
            emitAddSongWhenCreatingQueue: false,
            emitAddListWhenCreatingQueue: false,
            plugins: [
                new SpotifyPlugin({
                    emitEventsAfterFetching: true
                }),
                new SoundCloudPlugin(),
                new YtDlpPlugin()
            ]
        })
        this.config = new Config(option);
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
    }
}