const Command = require('../../Core/command');
const request = require('request');

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
            let playtime = serverQueue.playtime;
            let totalsec = playtime;
            let h = Math.floor(playtime / 3600);
            if (h < 10) h = "0" + h;
            playtime = playtime % 3600;
            let m = Math.floor(playtime / 60);
            if (m < 10) m = "0" + m;
            playtime = playtime % 60;
            let s = playtime;
            if (s < 10) s = "0" + s;
            
            let bar;
            if(serverQueue.songs[0].live && serverQueue.songs[0].lengthSeconds === 0){
                bar = this.main.util.progressbar(100, 100);
            }else{
                bar = this.main.util.progressbar(serverQueue.songs[0].lengthSeconds, totalsec);
            }

            request.get('https://api.ipify.org/?format=json', {}, async (err, res, body) => {
                if(!err){
                    let queueMSGcontent = "\n" + `${message.author}` + `\n只顯示15 首音樂! [[點我查看完整歌單](http://${JSON.parse(body).ip}:${this.main.config.Port}/music/${message.guild.id})]\n` + `__**歌曲列表:**__` + "\n" + `${serverQueue.songs.map(song => `⌛ <@${song.author.id}>添加的**\`${song.title}\`** ${song.length}`).slice(0, 15).join('\n')}` + "\n\n總共有:**" + serverQueue.songs.length + "**首音樂\n\n" + `**現正播放:** **\`${serverQueue.songs[0].title}\`**\n${h}:${m}:${s}/${serverQueue.songs[0].length}\n\n${bar}\n\n語音頻道: ${serverQueue.songs[0].guildtag}的${serverQueue.voiceChannel.name}\n 單曲循環播放: ${serverQueue.loop ? "開啟":"關閉"}\n清單循環播放: ${serverQueue.loopAll ? "開啟":"關閉"}`;
                    let queueMSG = this.main.util.createEmbed(message.author, null, queueMSGcontent, null, 0xcc0000);
                    try {
                        await this.main.util.SDM(message.channel, queueMSG, message.author);
                    }catch(e){}
                }else{
                    let queueMSGcontent = "\n" + `${message.author}` + "\n只顯示15 首音樂!\n" + `__**歌曲列表:**__` + "\n" + `${serverQueue.songs.map(song => `⌛ <@${song.author.id}>添加的**\`${song.title}\`** ${song.length}`).slice(0, 15).join('\n')}` + "\n\n總共有:**" + serverQueue.songs.length + "**首音樂\n\n" + `**現正播放:** **\`${serverQueue.songs[0].title}\`**\n${h}:${m}:${s}/${serverQueue.songs[0].length}\n\n${bar}\n\n語音頻道: ${serverQueue.songs[0].guildtag}的${serverQueue.voiceChannel.name}\n 單曲循環播放: ${serverQueue.loop ? "開啟":"關閉"}\n清單循環播放: ${serverQueue.loopAll ? "開啟":"關閉"}`;
                    let queueMSG = this.main.util.createEmbed(message.author, null, queueMSGcontent, null, 0xcc0000);
                    try {
                        await this.main.util.SDM(message.channel, queueMSG, message.author);
                    }catch(e){}
                }
            })
        }
    }
}