const Command = require('../../Core/command');

module.exports = class MusicPlayCommand extends Command {
    constructor(main){
        super(main, {
            name: "playnow",
            category: "音樂",
            help: "立即播放指定音樂!",
            args: [{
                name: `url / 搜尋關鍵字`,
                desc:`放入Youtube連結 不能為playlist`
            }],
            caseSensitive: true
        });
    }
    async run(message, args, prefix){
        let processtime = new Date().getTime();
        message.delete().catch();
        let serverQueue = this.main.util.getServerQueue(message.guild.id);
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
            let Noplaylist = this.main.util.createEmbed(message.author, null, `${message.author}, Senpai 立即播放功能不允許導入播放清單呢!`);
            try{
                this.main.util.SDM(message.channel, Noplaylist, message.author);
            }catch(e){}
            return;
        }else{
            try{
                var video = await this.main.util.getVideo(url);
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
                } catch(err){
                    let noResult = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 我沒法取得任何搜尋結果! (可能因為Youtube Api 限額超過上限)`, null, 0xcc0000);
                    this.main.util.SDM(message.channel, noResult, message.author);
                    return;
                }
            }
            if(!serverQueue){
                await this.main.util.handleVideo(video, message, message.author, voiceChannel);
            }else{
                await this.main.util.handleVideo(video, message, message.author, voiceChannel);
                let before = serverQueue.songs[0];
                let Newestsong = serverQueue.songs[serverQueue.songs.length - 1];
                await serverQueue.songs.pop();
                await serverQueue.songs.unshift(Newestsong);
                await serverQueue.songs.unshift(before);
                await serverQueue.connection.dispatcher.end("");
                serverQueue = await this.main.util.getServerQueue(message.guild.id);
				setTimeout(async ()=> {
                    //renew serverQueue
					let done = await this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 已經為你優先播放\n<@${serverQueue.songs[0].author.id}>添加的**${serverQueue.songs[0].title}**!`, null, 0xcc0000);
					await this.main.util.SDM(message.channel, done, message.author);
				}, 1500);
            }
        }
    }
}