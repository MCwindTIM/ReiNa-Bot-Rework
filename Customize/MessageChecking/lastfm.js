const Discord = require('discord.js');

module.exports.run = async (ReiNa, message) =>{
    //filter Only MCwind's Discord Server can trigger this
    if(message.guild.id != "398062441516236800") return;
    if(!message.embeds[0]) return;
        //filter .fm message
        if(message.embeds[0].author.name.startsWith('Now playing -')){
            let fullSong = getSongName(message.embeds[0].description);
            //choose voiceChannel
            let voiceChannel;
            const serverQueue = ReiNa.util.getServerQueue(message.guild.id);
            if(!serverQueue){
                //not playing music checking | Checking BotOwner is inside a voice channel?
                if(ReiNa.bot.guilds.cache.get('398062441516236800').members.cache.get(ReiNa.config.ownerID).voice.channel)
                {
                    //set VC to BotOwner's voice channel
                    voiceChannel = ReiNa.bot.guilds.cache.get('398062441516236800').members.cache.get(ReiNa.config.ownerID).voice.channel;
                }else{
                    //music channel
                    voiceChannel = ReiNa.bot.channels.cache.get('398064718725644290');
                }
            }else{
                //server playing music
                voiceChannel = serverQueue.voiceChannel;
            }
            //search and handle youtube video
            try{
                let searchString = fullSong;
                let videos = await ReiNa.util.searchVideos(searchString, 1);
                const videoIndex = parseInt(1);
                var video = await ReiNa.util.getVideoByID(videos[videoIndex -1].id);
            } catch(err){
                console.log(err)
                let noResult = ReiNa.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 我沒法取得任何搜尋結果!`, null, 0xcc0000);
                ReiNa.util.SDM(message.channel, noResult, message.author);
                return;
            }
            //handle video
            return ReiNa.util.handleVideo(video, message, message.author, voiceChannel);
        }
}

function getSongName(string){
    const Namefilter = string.match(/\[(.*?)\]/);
    const Authorfilter = string.match(/\*\*(.*?)\*\*/);
    let fullSongTrack = '';
    //process song name
    if(Namefilter){
        fullSongTrack = Namefilter[1];
    } else {
        fullSongTrack = string.split('\n')[0];
    }

    //adding author name
    if(Authorfilter){
        fullSongTrack = Authorfilter[1] + ' - ' + fullSongTrack;
    }

    return fullSongTrack;
}

module.exports.name = "Last.fm";