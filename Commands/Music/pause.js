const Command = require('../../Core/command');

module.exports = class MusicPauseCommand extends Command {
    constructor(main){
        super(main, {
            name: "pause",
            category: "音樂",
            help: "暫停音樂播放",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        const serverQueue = this.main.util.getServerQueue(message.guild.id);
        if(!serverQueue){
            let NotPlayingSong = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 此伺服器沒有在播放音樂, 所以沒有東西能暫停播放哦!`, null, 0xcc0000);
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
            let NotInSameVC = this.main.util.createEmbed(message.author, null, `${message.author} 你不在音樂播放的語音頻道中, 無法暫停音樂!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NotInSameVC, message.author);
            }catch(e){}
            return;
        }
        if(serverQueue && serverQueue.playing){
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause(true);
            clearTimeout(serverQueue.timer.timeOutObj);
            let paused = this.main.util.createEmbed(message.author, null, `⏸${message.author} Senpai, 已經為你暫停音樂!\n\n語音頻道: ${serverQueue.voiceChannel.name}`, null, 0xcc0000);
            try{
                this.main.util.SDM(message.channel, paused, message.author);
            }catch(e){}
        }
    }
}