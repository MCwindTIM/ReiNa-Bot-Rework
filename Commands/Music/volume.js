const Command = require('../../Core/command');

module.exports = class MusicVolumeCommand extends Command {
    constructor(main){
        super(main, {
            name: "volume",
            category: "音樂",
            help: "調整音量大小",
            args: [{
                name: "音量",
                desc: "0.1 - 3.0"
            }]
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
        if(!args[0] || isNaN(args[0])){
            let nowVolume = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 現在的音量是: **${serverQueue.volume}**\n\n如果要更改音量 請輸入有效數值 **0.1-3.0**`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, nowVolume, message.author);
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
            let NotInSameVC = this.main.util.createEmbed(message.author, null, `${message.author} 你不在音樂播放的語音頻道中, 無法設定音量!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NotInSameVC, message.author);
            }catch(e){}
            return;
        }
        if(args[0] > 3) args[0] = 3;
        if(args[0] < 0) args[0] = 0.1;
        let volumeSetting = this.main.util.createEmbed(message.author, null, `${message.author}是的Senpai, 我把音量調整到: **${args[0]}** 了哦!\n(為了大家的耳朵著想, 音量範圍為 **0.1** 到 **3**)`, null, 0xcc0000);
        try{
            await this.main.util.SDM(message.channel, volumeSetting, message.author);
        } catch (e){}
        serverQueue.volume = args[0];
	    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    }
}