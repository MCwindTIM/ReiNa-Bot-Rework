const Command = require('../../Core/command');

module.exports = class MusicShuffleCommand extends Command {
    constructor(main){
        super(main, {
            name: "shuffle",
            category: "音樂",
            help: "隨機排列歌曲!",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        const serverQueue = this.main.util.getServerQueue(message.guild.id);
        if(!message.member.voice.channel){
            let NotInVC = this.main.util.createEmbed(message.author, null, `${message.author} 你不在語音頻道呀!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NotInVC, message.author);
            }catch(e){}
            return;
        }
        if(!serverQueue){
            let NoSong = this.main.util.createEmbed(message.author, null, `💢${message.author} Senpai, 此伺服器沒有在播放音樂呀!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NoSong, message.author);
            }catch(e){}
            return;
        }
        if(message.member.voice.channel != serverQueue.voiceChannel){
            let NotInSameVC = this.main.util.createEmbed(message.author, null, `${message.author} 你不在播放音樂的語音頻道呀!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, NotInSameVC, message.author)
            }catch(e){}
            return;
        }

        let Shuffled = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 已經為你隨機排列播放清單!\n\n${serverQueue.voiceChannel.name}`, null, 0xcc0000);
        try{
            await this.main.util.SDM(message.channel, Shuffled, message.author);
        }catch(e){}
        let np = serverQueue.songs[0];
        serverQueue.songs.shift();
        serverQueue.songs = this.main.util.shuffle(serverQueue.songs);
        serverQueue.songs.unshift(np);
        this.main.event.emit('UpdateMusicQueue');
    }
}