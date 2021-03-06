const Command = require('../../Core/command');

module.exports = class MusicLoopAllCommand extends Command {
    constructor(main){
        super(main, {
            name: "loopall",
            category: "音樂",
            help: "切換清單循環播放",
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
            let NotInSameVC = this.main.util.createEmbed(message.author, null, `${message.author} 你不在音樂播放的語音頻道中, 無法切換清單循環!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NotInSameVC, message.author);
            }catch(e){}
            return;
        }
        if(serverQueue.songs[0].live){
            let LiveNoLoop = this.main.util.createEmbed(message.author, null, `${message.author} 正在播放直播串流, 無法使用循環播放功能!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, LiveNoLoop, message.author);
            }catch(e){}
            return;
        }

        let status = serverQueue.loop ? `開啟`:`關閉`;
        if(serverQueue.loopAll == false){
            let setLoopTrue = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 已經為你循環播放\n**\`整個播放列表\`**!\n\n語音頻道: ${serverQueue.songs[0].guildtag}的${serverQueue.voiceChannel.name}`, null, 0xcc0000)
            try{
                this.main.util.SDM(message.channel, setLoopTrue, message.author);
            }catch(e){}
            serverQueue.loopAll = true;
            serverQueue.looplist = serverQueue.songs;
            this.main.util.setActivity(this.main, { string: `正在播放: ${serverQueue.songs[0].title} 由 ${serverQueue.songs[0].authortag} 在 ${serverQueue.songs[0].guildtag}添加, ||[單曲循環播放: ${status}]||`, type:2});
        }else{
            let setLoopFalse = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 已經為你關閉循環播放\n**\`整個播放列表\`**!\n\n語音頻道: ${serverQueue.songs[0].guildtag}的${serverQueue.voiceChannel.name}`, null, 0xcc0000)
            try{
                this.main.util.SDM(message.channel, setLoopFalse, message.author);
            }catch(e){}
            serverQueue.loopAll = false;
            this.main.util.setActivity(this.main , { string: `正在播放: ${serverQueue.songs[0].title} 由 ${serverQueue.songs[0].authortag} 在 ${serverQueue.songs[0].guildtag}添加, ||[單曲循環播放: ${status}]||`, type:2});
        }
        
        this.main.event.emit('UpdateMusicQueue');
    }
}