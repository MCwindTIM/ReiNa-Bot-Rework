const Command = require('../../Core/command');

module.exports = class MusicStopCommand extends Command {
    constructor(main){
        super(main, {
            name: "stop",
            category: "音樂",
            help: "停止播放音樂",
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
        if(!message.member.voice.channel){
            let NotInVC = this.main.util.createEmbed(message.author, null, `${message.author} 你不在語音頻道呀!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NotInVC, message.author);
            }catch(e){}
            return;
        }
        if(message.member.voice.channel != serverQueue.voiceChannel){
            let NotInSameVC = this.main.util.createEmbed(message.author, null, `${message.author} 你不在音樂播放的語音頻道中, 無法跳過音樂!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NotInSameVC, message.author);
            }catch(e){}
            return;
        }
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('');
    }
}