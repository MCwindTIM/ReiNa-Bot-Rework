const Command = require('../../Core/command');

module.exports = class MusicQueueCommand extends Command {
    constructor(main){
        super(main, {
            name: "queue",
            category: "音樂",
            help: "顯示伺服器播放列表!",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        const serverQueue = this.main.util.getServerQueue(message.guild.id);
        if(!serverQueue){
            let NoSong = this.main.util.createEmbed(message.author, null, `💢${message.author} Senpai, 此伺服器沒有在播放音樂呀!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NoSong, message.author);
            }catch(e){}
            return;
        }else{
            let playtime = Date.now() - this.main.util.getMusicTimer(message.guild.id) + (parseInt(serverQueue.songs[0].startFrom.replace('s', '')) * 1000);
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

            let queueMSGcontent = "\n" + `${message.author}` + "\n因為Discord有限制信息最多只能有1024個字符, 所以我最多只會顯示15 首音樂哦!\n" + `__**歌曲列表:**__` + "\n" + `${serverQueue.songs.map(song => `⌛ <@${song.author.id}>添加的**\`${song.title}\`** ${song.length}`).slice(0, 15).join('\n')}` + "\n\n總共有:**" + serverQueue.songs.length + "**首音樂\n\n" + `**現正播放:** **\`${serverQueue.songs[0].title}\`**\n${h}:${m}:${s}/${serverQueue.songs[0].length}\n\n${bar}\n\n語音頻道: ${serverQueue.songs[0].guildtag}的${serverQueue.voiceChannel.name}`;
            let queueMSG = this.main.util.createEmbed(message.author, null, queueMSGcontent, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, queueMSG, message.author);
            }catch(e){console.log(e)}
        }
    }
}