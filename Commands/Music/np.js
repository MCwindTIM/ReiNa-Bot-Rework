const Command = require('../../Core/command');

module.exports = class MusicNowplayingCommand extends Command {
    constructor(main){
        super(main, {
            name: "np",
            category: "音樂",
            help: "顯示現正播放的音樂!",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        const serverQueue = this.main.util.getServerQueue(message.guild.id);
        if(!serverQueue){
            let noSong = this.main.util.createEmbed(message.author, null, `${message.author} 你所在的伺服器沒有在播放音樂哦!`, null, 0xcc0000);
            try{
                this.main.util.SDM(message.channel, noSong, message.author);
            }catch(e){}
            return;
        }
        let playtime = Date.now() - this.main.util.getMusicTimer(message.guild.id);
        let h = Math.floor(playtime / 3600000);
        if (h < 10) h = "0" + h;
        playtime = playtime % 3600000;
        let m = Math.floor(playtime / 60000);
        if (m < 10) m = "0" + m;
        playtime = playtime % 60000;
        let s = Math.floor(playtime / 1000);
        if (s < 10) s = "0" + s;
        playtime = playtime % 1000;
        if (playtime < 10) playtime = "0" + playtime;
        let Nowplaying = this.main.util.createEmbed(message.author, null, `${message.author}\n\n🎶 現正播放: ${serverQueue.songs[0].author}添加的**${serverQueue.songs[0].title}** ${h}:${m}:${s}/${serverQueue.songs[0].length}\n\n語音頻道: ${serverQueue.songs[0].guildtag}的${serverQueue.voiceChannel.name}\n\n如果Senpai想要網址的話, 我放在下面哦!\n${serverQueue.songs[0].url}`, null, 0xcc0000);
        try{    
            this.main.util.SDM(message.channel, Nowplaying, message.author);
        }catch(e){}
    }
}