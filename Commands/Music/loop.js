const Command = require('../../Core/command');

module.exports = class MusicLoopCommand extends Command {
    constructor(main){
        super(main, {
            name: "loop",
            category: "音樂",
            help: "切換單曲循環播放",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        const serverQueue = this.main.util.getServerQueue(message.guild.id);
        if(!serverQueue){
            let NotPlayingSong = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 此伺服器沒有在播放音樂, 所以沒有東西能循環播放哦!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NotPlayingSong, message.author);
            }catch(e){}
            return;
        }
        if(!message.member.voice.channel){
            let NotInVC = this.main.util.createEmbed(message.author, null, `${message.author} 你不在語音頻道呀!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NotInVC, message.author);
            }catch(e){}
            return;
        }
        if(message.member.voice.channel != serverQueue.voiceChannel){
            let NotInSameVC = this.main.util.createEmbed(message.author, null, `${message.author} 你不在音樂播放的語音頻道中, 無法切換單曲循環!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NotInSameVC, message.author);
            }catch(e){}
            return;
        }
        if(serverQueue.loop == false){
            let setLoopTrue = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 已經為你循環播放\n<@${serverQueue.songs[0].author.id}>添加的**${serverQueue.songs[0].title}**!\n\n語音頻道: ${serverQueue.songs[0].guildtag}的${serverQueue.voiceChannel.name}`, null, 0xcc0000)
            try{
                this.main.util.SDM(message.channel, setLoopTrue, message.author);
            }catch(e){}
            serverQueue.loop = true;
            this.main.util.setActivity(this.main, { string: `正在播放: ${serverQueue.songs[0].title} 由 ${serverQueue.songs[0].authortag} 在 ${serverQueue.songs[0].guildtag}添加, ||[單曲循環播放: 開啟]||`, type:2});
            return;
        }else{
            let setLoopFalse = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 已經為你關閉循環播放\n<@${serverQueue.songs[0].author.id}>添加的**${serverQueue.songs[0].title}**!\n\n語音頻道: ${serverQueue.songs[0].guildtag}的${serverQueue.voiceChannel.name}`, null, 0xcc0000)
            try{
                this.main.util.SDM(message.channel, setLoopFalse, message.author);
            }catch(e){}
            serverQueue.loop = false;
            this.main.util.setActivity(this.main , { string: `正在播放: ${serverQueue.songs[0].title} 由 ${serverQueue.songs[0].authortag} 在 ${serverQueue.songs[0].guildtag}添加, ||[單曲循環播放: 關閉]||`, type:2});
            return;
        }
    }
}