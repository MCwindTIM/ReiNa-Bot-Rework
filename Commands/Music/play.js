const Command = require('../../Core/command');

module.exports = class MusicPlayCommand extends Command {
    constructor(main){
        super(main, {
            name: "play",
            category: "音樂",
            help: "播放音樂!",
            args: [{
                name: `url / 搜尋關鍵字`,
                desc:`放入Youtube連結或者搜尋關鍵字以播放音樂`
            }],
            caseSensitive: true
        });
    }
    async run(message, args, prefix){
        let processtime = new Date().getTime();
        message.delete().catch();
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel){
            let noVC = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} Senpai, 我很抱歉不能播放音樂, 因為你需要在語音頻道內`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, noVC, message.author);
            }catch (e){}
            return;
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')){
            let noConnectPerm = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author}, 很抱歉我沒有權限進入語音頻道!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, noConnectPerm, message.author);
            }catch(e){}
            return;
        }
        if(!permissions.has('SPEAK')){
            let noSpeakPerm = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author}, 我沒有權限在語音頻道發話呀!`, null, 0xcc0000);
            try{
                await this.main.util.SDM(message.channel, noSpeakPerm, message.author);
            }catch(e){}
            return;
        }
        let url = message.content.split(' ')[1] ? message.content.split(' ')[1].replace(/<(.+)>/g, '$1') : '';
        if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/) || url.match(/^https:\/\/(?:www\.)?youtube\.com\/watch\?((v=[^&\s]*&list=[^&\s]*)|(list=[^&\s]*&v=[^&\s]*))(&[^&\s]*)*$/)){
            const playlist = await this.main.util.getPlaylist(url).catch(err =>{
                let playlistNotFound = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author}, 取得播放列表時發生錯誤! (可能是私人播放清單導致)`, null, 0xcc0000);
                this.main.util.SDM(message.channel, playlistNotFound, message.author);
                return;
            });
            if(playlist === undefined) return;
            const videos = await this.main.util.getYTVideos(playlist);
            let item = 0;
            for(const video of Object.values(videos)){
                if(video.raw.status){
                    item = item + 1;
                    if(video.raw.status.privacyStatus === 'public' || video.raw.status.privacyStatus === 'unlisted'){
                        const video2 = await this.main.util.getVideo(video.id);
                        await this.main.util.handleVideo(video2, message, message.author, voiceChannel, true);
                    }else{
                        if(video.raw.status.privacyStatus === 'private'){item = item - 1}
                    }
                }
            }
            let playlistprocesstime = new Date().getTime();
            let addplaylist = this.main.util.createEmbed(message.author, null, `✅ 將整個播放清單: **${playlist.title}** 加入到播放列表中!\n\n此播放清單共加入 ${item} 首音樂!\n\n\n**此信息將會在5秒後自動刪除**\n\n\n載入耗時: ${(playlistprocesstime - processtime) / 1000}秒.`);
            message.channel.send(addplaylist)
            .then(msg => {
				msg.delete({timeout: 5000}).catch(console.error);
			}).catch();
            return;
        }else{
            try{
                var video = await this.main.util.getVideo(url);
                let timeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)(?:(\?t|&start)=(\d+))?.*/g;
                let startTime = timeRegex.exec(url);
                if(+startTime[startTime.length - 1]){
                    if(!args[1]){
                        args[1] = +startTime[startTime.length -1];
                    }
                }
            } catch (err){
                try{
                    let searchString = args.join(' ');
                    let videos = await this.main.util.searchVideos(searchString, 5);
                    let index = 0;
                    let ChooseSong = this.main.util.createEmbed(message.author, `音樂搜尋列表`, `${message.author}` + "\n**歌曲選擇:**\n" + `${videos.map(video2 => `**${++index}.** \`${video2.title}\``).join('\n')}\n\n請Senpai在1到5號結果中選擇想播放的音樂哦!\n\n`, `https://www.youtube.com/results?search_query=${args.join("+")}`, 0xcc0000);
                    message.channel.send(ChooseSong)
                    .then(msg => {
                        msg.delete({timeout: 5000}).catch(console.error);
                    }).catch();
                    try{
                        var response;
                        await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 6, {
                            max: 1,
                            time: 10000,
                            errors: ['time']
                        }).then(fetched => {
                            response = fetched;
                            message.channel.bulkDelete(fetched).catch();
                        });
                    }catch(err){
                        let OutOfTime = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 沒有正確的參數或者超過輸入參數的時間!`, null, 0xcc0000);
                        this.main.util.SDM(message.channel, OutOfTime, message.author);
                        return;
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await this.main.util.getVideo(videos[videoIndex -1].id);
                    return this.main.util.handleVideo(video, message, message.author, voiceChannel, false);
                } catch(err){
                    console.log(err)
                    let noResult = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 我沒法取得任何搜尋結果! (可能因為Youtube Api 限額超過上限)`, null, 0xcc0000);
                    this.main.util.SDM(message.channel, noResult, message.author);
                    return;
                }
            }
            return this.main.util.handleVideo(video, message, message.author, voiceChannel, false, args[1]? parseInt(args[1]) : 0);
        }
    }
}