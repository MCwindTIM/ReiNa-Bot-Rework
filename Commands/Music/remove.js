const Command = require('../../Core/command');

module.exports = class MusicRemoveCommand extends Command {
    constructor(main){
        super(main, {
            name: "remove",
            category: "音樂",
            help: "移除指定隊列音樂",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        const serverQueue = this.main.util.getServerQueue(message.guild.id);
        if(!serverQueue){
            let NotPlayingSong = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 此伺服器沒有在播放音樂, 所以沒有東西能跳過哦!`, null, 0xcc0000);
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
            let NotInSameVC = this.main.util.createEmbed(message.author, null, `${message.author} 你不在音樂播放的語音頻道中, 無法跳過音樂!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NotInSameVC, message.author);
            }catch(e){}
            return;
        }
        if(!args[0] || parseInt(args[0]) <= 0 || parseInt(args[0]) > serverQueue.songs.length){
            let unvaildArg = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 我需要知道移除第幾首音樂呀! 數值必須大於0並小於播放列表的音樂數目!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, unvaildArg, message.author);
            }catch(e){}
        }else{
            if(parseInt(args[0]) === 1){
                let skiped = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 已經為你跳過\n**\`${serverQueue.songs[0].title}\`** --由<@${serverQueue.songs[0].author.id}>添加!\n\n語音頻道: ${serverQueue.songs[0].guildtag}的${serverQueue.voiceChannel.name}`, null, 0xcc0000);
                try{
                    await this.main.util.SDM(message.channel, skiped, message.author);
                }catch(e){}
                serverQueue.connection.dispatcher.end("");
            }else{
                let target = parseInt(args[0]) - 1;
                let removed = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 已經為你從播放清單中移除\n**\`${serverQueue.songs[target].title}\`** --由<@${serverQueue.songs[target].author.id}>添加!\n\n語音頻道: ${serverQueue.songs[target].guildtag}的${serverQueue.voiceChannel.name}`, null, 0xcc0000);
                serverQueue.songs.splice(target, 1);
                this.main.event.emit('UpdateMusicQueue');
                try{
                    await this.main.util.SDM(message.channel, removed, message.author);
                }catch(e){}
            }
        }
    }
}