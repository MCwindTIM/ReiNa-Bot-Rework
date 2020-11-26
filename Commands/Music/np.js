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
        let playtime = serverQueue.playtime;
        let totalsec = playtime;
        let h = Math.floor(playtime / 3600);
        if (h < 10) h = "0" + h;
        playtime = playtime % 3600;
        let m = Math.floor(playtime / 60);
        if (m < 10) m = "0" + m;
        playtime = playtime % 60;
        let s = playtime
        if (s < 10) s = "0" + s;
        let bar;
        if(!serverQueue.songs[0].live){
            let TotalArray = serverQueue.songs[0].length.split(":");
            let barTotal = parseInt(TotalArray[0])*60*60 + parseInt(TotalArray[1])*60 + parseInt(TotalArray[2]);
            let CurrentArray = `${h}:${m}:${s}`.split(":");
            let barCurrent = parseInt(CurrentArray[0])*60*60 + parseInt(CurrentArray[1])*60 + parseInt(CurrentArray[2]);
            bar = this.main.util.progressbar(barTotal, barCurrent);
        }else{
            bar = this.main.util.progressbar(100, 100);
        }
        let Nowplaying = this.main.util.createEmbed(message.author, null, `${message.author}\n\n🎶 現正播放: ${serverQueue.songs[0].author}添加的**\`${serverQueue.songs[0].title}\`** ${h}:${m}:${s}/${serverQueue.songs[0].length}\n\n${bar}\n\n語音頻道: ${serverQueue.songs[0].guildtag}的${serverQueue.voiceChannel.name}\n\n如果Senpai想要網址的話, 我放在下面哦! __影片ID:__ **${serverQueue.songs[0].id}**\n[[影片連結](${serverQueue.songs[0].url})]\n[[現正播放的時間連結](https://youtu.be/${serverQueue.songs[0].id}?t=${totalsec})]\n 單曲循環播放: ${serverQueue.loop ? "開啟":"關閉"}\n清單循環播放: ${serverQueue.loopAll ? "開啟":"關閉"}`, null, 0xcc0000);
        try{    
            this.main.util.SDM(message.channel, Nowplaying, message.author);
        }catch(e){}
    }
}