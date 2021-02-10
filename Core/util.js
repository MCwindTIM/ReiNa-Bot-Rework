const fs = require('fs');
const fsPath = require('fs-path');
const Discord = require('discord.js');
//音樂模塊
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');

//progressbar import
const pb = require('string-progressbar');

//request module
const request = require("request");


//delay
//const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = class Util {
    constructor(main){
        this.main = main;
        this.youtube = new YouTube(this.main.config.YoutubeAPI);
    }
    
    color = {
        Reset: "\x1b[0m",
        Bright: "\x1b[1m",
        Dim: "\x1b[2m",
        Underscore: "\x1b[4m",
        Blink: "\x1b[5m",
        Reverse: "\x1b[7m",
        Hidden: "\x1b[8m",

        FgBlack: "\x1b[30m",
        FgRed: "\x1b[31m",
        FgGreen: "\x1b[32m",
        FgYellow: "\x1b[33m",
        FgBlue: "\x1b[34m",
        FgMagenta: "\x1b[35m",
        FgCyan: "\x1b[36m",
        FgWhite: "\x1b[37m",

        BgBlack: "\x1b[40m",
        BgRed: "\x1b[41m",
        BgGreen: "\x1b[42m",
        BgYellow: "\x1b[43m",
        BgBlue: "\x1b[44m",
        BgMagenta: "\x1b[45m",
        BgCyan: "\x1b[46m",
        BgWhite: "\x1b[47m"
    }
    //shuffle
    shuffle(a) {
	    for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	    }
	    return a;
	}
    
    //隨機數
    getRandomInt(max){
        return Math.floor(Math.random() * max) + 1;
    }

    //創建Embed範例信息模塊
    createEmbed(author, title, content, url, color, Footer, FooterURL, imgURL, Thumbnail){
        author = author || this.main.bot.user;
        title = title || `ReiNa Bot Rework`;
        color = color || `#0099ff`;
        url = url || `https://github.com/MCwindTIM/ReiNa-Bot-Rework`;
        Footer = Footer || `ReiNa By 𝓖𝓻𝓪𝓷𝓭𝓞𝓹𝓮𝓻𝓪𝓽𝓸𝓻#7832`;
		FooterURL = FooterURL || this.main.bot.user.avatarURL();
        imgURL = imgURL || null;
        Thumbnail = Thumbnail || null;
        let embed = new Discord.MessageEmbed()
        .setAuthor(author.tag, author.avatarURL())
        .setColor(color)
        .setTitle(title)
        .setURL(url)
        .setDescription(content)
        .setTimestamp()
        .setFooter(Footer, FooterURL);
		if(imgURL){
			embed.setImage(imgURL);
        }
        if(Thumbnail){
            embed.setThumbnail(Thumbnail);
        }
        /*
        else{
            embed.setThumbnail(this.main.bot.user.avatarURL({format: "jpg", size: 4096}));
        }
        */
        return embed;
    }

    //請求 Youtube 播放列表
    async getPlaylist(url){
        return await this.youtube.getPlaylist(url);
    }

    //請求Youtube 影片
    async getVideo(url){
        return await ytdl.getInfo(url);
    }

    //搜尋Youtube 影片
    searchVideos(searchString, item){
        return this.youtube.searchVideos(searchString, item);
    }

    //請求 Youtube 影片
    getYTVideos(playlist){
        return playlist.getVideos();
    }

    //使用Youtube 影片ID 請求影片
    //getVideoByID(id){
    //    return this.youtube.getVideoByID(id);
    //}


    //處理Youtube影片
    async handleVideo(video, message, songAuthor, voiceChannel, playlist = false, startTime){
        const serverQueue = this.main.queue.get(message.guild.id);
        startTime = +video.videoDetails.lengthSeconds < +startTime || startTime == null || startTime == NaN  ? 0 : startTime;
        let videoLength = video.videoDetails.lengthSeconds;
        let vdh = Math.floor(videoLength / 3600);
        videoLength = videoLength % 3600;
        let vdm = Math.floor(videoLength / 60);
        videoLength = videoLength % 60;
        let vds = Math.floor(videoLength);
        if(vdh < 10) vdh = `0${vdh}`;
        if(vdm < 10) vdm = `0${vdm}`;
        if(vds < 10) vds = `0${vds}`;

        var song = {
            id: video.videoDetails.videoId,
            title: Discord.escapeMarkdown(video.videoDetails.title),
            url: `https://www.youtube.com/watch?v=${video.videoDetails.videoId}`,
            thumbnail: `https://i3.ytimg.com/vi/${video.videoDetails.videoId}/hqdefault.jpg`,
            length: video.videoDetails.isLiveContent && +video.videoDetails.lengthSeconds === 0 ? `:red_circle: Youtube 直播中` : `${vdh}:${vdm}:${vds}`,
            lengthSeconds: +video.videoDetails.lengthSeconds,
            author: songAuthor,
            guildtag: message.guild.name,
            live: video.videoDetails.isLiveContent && +video.videoDetails.lengthSeconds === 0,
            startTime: startTime,
            addTime: this.getTime()
        };
        if(!serverQueue){
            const queueConstruct = {
                guild: message.guild,
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 1,
                loop: false,
                loopAll: false,
                playing: true,
                playtime: 0,
                timer: {
                    timeOutObj: null,
                    startTime: null,
                    counter: null,
                },
                LiveDataLastUpdate: null,
                LiveEndChecker: null
            };
            this.main.queue.set(message.guild.id, queueConstruct);

            queueConstruct.songs.push(song);

            try{
                let connection = await voiceChannel.join();
                connection.voice.setSelfDeaf(true);
                queueConstruct.connection = connection;
                await this.play(message.guild, queueConstruct.songs[0]);
                this.main.event.emit('UpdateMusicQueue');
            }catch(err){
                console.log(err);
                this.main.queue.delete(message.guild.id);
                let embed = this.createEmbed(songAuthor, `ReiNa Bot Rework 錯誤`, `在進入語音頻道時發生錯誤! 嗚嗚嗚~\n\n\n**此信息將會在5秒後自動刪除**\n`, null, 0xcc0000);
                message.channel.send(embed)
                .then(msg => {
                    msg.delete({timeout: 5000}).catch(console.error);
                }).catch();
                return;
            }
        }else{
            serverQueue.songs.push(song);
            this.main.event.emit('UpdateMusicQueue');
            if(playlist) return undefined;
            else{
                let embed = this.createEmbed(songAuthor, null, `✅ 將**\`${song.title}\`**加入到播放列表中!\n\n\n**此信息將會在5秒後自動刪除**\n`, null, 0xcc0000);
                message.channel.send(embed)
                .then(msg => {
                    msg.delete({timeout: 5000}).catch(console.error);
                }).catch();
                return;
            }
        }
        return undefined;
    }

    //播放音樂
    async play(guild, song){
        
        const serverQueue = await this.main.queue.get(guild.id);

        let member = await this.main.bot.channels.cache.get(serverQueue.voiceChannel.id).members.size;

        if(!song){
            let noSong = this.createEmbed(null, null, `Senpai, 全部音樂已經播放完畢, 這裡就沒有我的事情了 需要我的時候再叫我吧!\n\n\n**此信息將會在5秒後自動刪除**\n`, null, 0xcc0000);
            serverQueue.textChannel.send(noSong)
            .then(msg => {
				msg.delete({timeout: 5000}).catch(console.error);
            }).catch();
            try{
                this.main.queue.delete(guild.id);
                this.setActivity(this.main);
                serverQueue.voiceChannel.leave();
            }catch(e){}
            return;
        }
        
        //檢查語音頻道除了自己還有沒有其他使用者
        if(member <= 1 || !member){
            //建立, 發送停止播放信息
            let stopPlayingMSG = this.createEmbed(serverQueue.songs[0].author, null, `${serverQueue.songs[0].author} Senpai, 現在語音頻道只剩我一個了呢! 為了更好更流暢的服務, 我就先停止播放音樂了, 需要播放音樂的話隨時都可以再叫我喲 (＾Ｕ＾)ノ~ＹＯ\n\n\n**此信息將會在5秒後自動刪除**\n`, null, 0xcc0000);
            serverQueue.textChannel.send(stopPlayingMSG)
            .then(msg => {
                //5秒後自動刪除信息
                msg.delete({timeout: 5000}).catch(console.error);
            }).catch();
            //離開語音頻道
            await serverQueue.voiceChannel.leave();
            //刪除伺服器歌曲列表
            await this.main.queue.delete(guild.id);
            //設置Discord狀態到預設狀態
            this.setActivity(this.main);
            return;
        }

        let dispatcher;
        let stream = ytdl(song.url, {
            requestOptions: {
                //request Headers
                headers: {
                    cookie: this.main.config.youtubeCookie,
                    'x-youtube-identity-token' : this.main.config.youtubeIdentityToken,
                },
                //end of req Headers
            },
            //end of reqOptions
            } //end of ytdl options
        )
        //Check video is live or not
        if(song.live && song.lengthSeconds === 0){
            //youtube live (always dont cache)

            //Bot will leave voiceChannel or play the next song when no data received from youtube live within 30 seconds
             serverQueue.LiveEndChecker = setInterval(() => {
                if(serverQueue.LiveDataLastUpdate === null) return;
                if(Date.now() - serverQueue.LiveDataLastUpdate > 30000){
                    clearInterval(serverQueue.LiveEndChecker);
                    serverQueue.LiveEndChecker = null;
                    serverQueue.connection.dispatcher.end("");
                }
            }, 500);
            stream.on('data', (chunk) =>{
                //Update Live Data receive time
                serverQueue.LiveDataLastUpdate = Date.now();
            });
            stream.on('error', e =>{
                    let error = this.createEmbed(song.author, `ReiNa Bot Rework 出錯啦`, `發生了一些問題, 如果這個問題很常見, 請到Github回報或聯絡Bot擁有人!`, null, 0xcc0000);
                    error.addField('發生問題的影片資訊(Debug)', `\`\`\`javascript\n影片標題: ${song.title}\n影片ID: ${song.id}\n直播? ${song.live}\n\`\`\``);
                    error.addField('錯誤信息', `\`\`\`javascript\n${e.message}\n\`\`\``);
                    this.SDM(serverQueue.textChannel, error, song.author);
            })
            dispatcher = serverQueue.connection.play(stream)
            .on('finish', end => {
                serverQueue.songs.shift();
                this.play(guild, serverQueue.songs[0]);
                this.main.event.emit('UpdateMusicQueue');
            })
            .on('error', e => {
                serverQueue.songs.shift();
                this.play(guild, serverQueue.songs[0]);
                this.main.event.emit('UpdateMusicQueue');
                this.setActivity(this.main);
            });
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            let embed = this.createEmbed(song.author, null, `🎶 開始播放: <@${song.author.id}>添加的**\`${song.title}\`**\n\n語音頻道: **${serverQueue.songs[0].guildtag}的${serverQueue.voiceChannel.name}**\n\n\n**此信息將會在5秒後自動刪除**\n`);
            serverQueue.textChannel.send(embed)
                .then(msg => {
                msg.delete({timeout: 5000}).catch(console.error);
                }).catch();
            let looping = '';
            (serverQueue.loop == true) ? looping = "開啟" : looping = "關閉";
            this.setActivity(this.main, { string: `正在播放: ${song.title} 由 ${song.author.tag}, ||[單曲循環播放: ${looping}]||`, type: 2});
            
            clearTimeout(serverQueue.timer.timeOutObj);
            serverQueue.playtime = 0;
            serverQueue.timer.startTime = new Date().getTime();
            serverQueue.timer.counter = 0
            serverQueue.timer.timeOutObj = setTimeout(() => {this.fixed(serverQueue)}, 1000);
            console.log(`${song.title} → ${song.id} 為即時直播串流!`);
        }else{
            stream.on('error', e =>{
                let error = this.createEmbed(song.author, `ReiNa Bot Rework 出錯啦`, `發生了一些問題, 如果這個問題很常見, 請到Github回報或聯絡Bot擁有人!`, null, 0xcc0000);
                error.addField('發生問題的影片資訊(Debug)', `\`\`\`javascript\n影片標題: ${song.title}\n影片ID: ${song.id}\n直播? ${song.live}\n\`\`\``);
                error.addField('錯誤信息', `\`\`\`javascript\n${e.message}\n\`\`\``);
                this.SDM(serverQueue.textChannel, error, song.author);
            })
            //設置dispatcher (與直播影片不一樣的設定)
            dispatcher = serverQueue.connection.play(ytdl(song.url, {
                requestOptions: {
                    //request Headers
                    headers: {
                        cookie: this.main.config.youtubeCookie,
                        'x-youtube-identity-token' : this.main.config.youtubeIdentityToken,
                    },
                    //end of req Headers
                },
                //end of reqOptions
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
                //end of ytdl options
            }), {seek: song.startTime})
            .on('finish', end => {
                //歌曲完結時檢查 歌曲循環/歌單循環是否開啟
                if(serverQueue.loop == false){
                    if(serverQueue.loopAll == false){
                        serverQueue.songs.shift();
                    }else{
                        if(serverQueue.loopAll == true){
                            serverQueue.songs.push(serverQueue.songs[0]);
                            serverQueue.songs.shift();
                        }
                    }
                }
                else {
                    if(serverQueue.loop == true){
                        serverQueue.songs.unshift(serverQueue.songs[0]);
                        serverQueue.songs.shift();
                    }
                }
                this.play(guild, serverQueue.songs[0]);
                this.main.event.emit('UpdateMusicQueue');
            })
            .on('error', e => {
                serverQueue.songs.shift();
                this.play(guild, serverQueue.songs[0]);
                this.main.event.emit('UpdateMusicQueue');
                this.setActivity(this.main);
            });
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            let embed = this.createEmbed(song.author, null, `🎶 開始播放: <@${song.author.id}>添加的**\`${song.title}\`**\n\n語音頻道: **${serverQueue.songs[0].guildtag}的${serverQueue.voiceChannel.name}**\n\n\n**此信息將會在5秒後自動刪除**\n`);
            serverQueue.textChannel.send(embed)
                .then(msg => {
                msg.delete({timeout: 5000}).catch(console.error);
                }).catch();
            let looping = '';
            (serverQueue.loop == true) ? looping = "開啟" : looping = "關閉";
            this.setActivity(this.main, {string: `正在播放: ${song.title} 由 ${song.author.tag} 添加, ||[單曲循環播放: ${looping}]||`, type: 2});
            clearTimeout(serverQueue.timer.timeOutObj);
            serverQueue.playtime = 0 + song.startTime;
            serverQueue.timer.startTime = new Date().getTime();
            serverQueue.timer.counter = 0;
            serverQueue.timer.timeOutObj = setTimeout(() => {this.fixed(serverQueue)}, 1000);
            console.log(`${this.color.FgYellow}${this.getTime()}${this.color.Reset} ${song.title} → ${song.id} 開始播放!`);
        }
    }
    
    //use to fix setinterval timing slowly drifts away from staying accurate
    //for counting current playing song's playtime in discord voice channel
    fixed(queue){
        queue.playtime++;
        queue.timer.counter++;
        var offset = new Date().getTime() - (queue.timer.startTime + queue.timer.counter * 1000);
        var nextTime = 1000 - offset;
        if(nextTime <0 ) nextTime = 0;
        queue.timer.timeOutObj = setTimeout(() => {this.fixed(queue)}, nextTime);
    }

    //Get ServerQueue
    getServerQueue(gid){
        return this.main.queue.get(gid);
    }

    //信息發送模塊
    async SDM(channel, message, author, trigger){
        channel.startTyping();
        const sentMsg = await channel.send(message);
        await sentMsg.react('🗑');
        const collector = sentMsg.createReactionCollector((reaction, user) => reaction.emoji.name === '🗑' && !user.bot && user.id === author.id || reaction.message.member.hasPermission('MANAGE_MESSAGES') === true && !user.bot && reaction.emoji.name === '🗑', { time: 1800000, max: 1}); //30mins
        collector.on('end', async collected => {
            if(collected.size){
                try{
                    await sentMsg.delete().catch((e) => { });
                    if(trigger){
                        await trigger.delete().catch((e) => { });
                    }
                } catch (err) { }
                return;
            }
            if(sentMsg.guild.me.hasPermission('MANAGE_MESSAGES')) { 
                try{
                    await sentMsg.reactions.removeAll();
                } catch(e){}
            }
            else{ 
                try{
                    sentMsg.reactions.removeAll() 
                } catch(e){}
            }
        })
        channel.stopTyping();
        return sentMsg;
    }

    progressbar(total, current, size){
        current = current || 0;
        size = size || 30;
        return `[${pb(total, current, size)[0]}]`;
    }

    //function that prevent xss
    htmlEscape(text) {
        return text.replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/"/g, '&quot;').
        replace(/'/g, '&#027;').
        replace(/>/g, '&gt').
        replace(/\//g, '&#047');
    }
    
    //Get MusicTimer
    //getMusicTimer(gid){
    //    return this.main.musictimer.get(gid);
    //}

    //Check Owner Perm
    checkOwner(uid){
        if(uid != this.main.config.ownerID){
            return false;
        }
        return true;
    }

    //set bot activity (status)
    setActivity(ReiNa, status){
        status ? ReiNa.bot.user.setActivity(status.string, {type: status.type}): status = { string: `${ReiNa.config.prefix}help | ReiNa Is Here! Nya~~~~`, type: 3};
		if(ReiNa.queue.size === 0){
			ReiNa.bot.user.setActivity(status.string, {type: status.type});
		}
    }


    //check user perm (allow eval command)
    checkUserPerm(uid){
        let pass = this.main.config.adminID.includes(uid) || +uid === +this.main.config.ownerID ? true : false;
        return pass;
    }
    

    //check attachIsImage?
    attachIsImage(msgAttach){
        let url = msgAttach.url;
        if(url.indexOf("png", url.length - "png".length) !== -1){return true}
        if(url.indexOf("jpg", url.length - "jpg".length) !== -1){return true}
        if(url.indexOf("gif", url.length - "gif".length) !== -1){return true}
        if(url.indexOf("jpeg", url.length - "jpeg".length) !== -1){return true}
        return false;
    }
    

    //fetch (return obj)
    async fetchJSON(url){
        request.get(url, {}, async (err, req, body) => {
            if(err || req.statusCode != 200){
                return undefined;
            }
            if(!err && req.statusCode === 200){
                let obj = await JSON.parse(body);
                return obj;
            }
        });
    }

    //Get time
    getTime(){
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let year = date_ob.getFullYear();
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        return "[" + year + "-" + month + "-" + date + " | " + hours + ":" + minutes + ":" + seconds + "]";
    }

    load() {
        let commands = new Map();
        let events = new Map();
        const queue = new Map();
        let time = Date.now();
        let taken = 0;
        const commandDir = `./Commands/`;

        return new Promise((resolve, reject) => {
            fs.readdirSync(commandDir).forEach(folder => {
                let command = false;
                fs.readdirSync(`${commandDir}${folder}/`).forEach(file => {
                    let help = [];
                    if(file.match(/\.js$/) !== null && file !== 'index.js'){
                        command = `.${commandDir}${folder}/${file}`;
                        delete require.cache[require.resolve(command)];
                        command = new (require(command))(this.main);

                        if(commands.has(file.toLowerCase())) console.log(`檔案 ${file} 的指令 ${command.name} 發生衝突! 將不會被載入!`);
                        else commands.set(file.slice(0, -3).toLowerCase(), command);

                        if(command.alias.length) {
                            command.alias.forEach(item => {
                                if(commands.has(item.toLowerCase())) console.log(`指令別稱 ${item} (檔案${file} 的指令 ${command.name}) 發生衝突! 將不會被載入!`);
                                else commands.set(item.toLowerCase(), command);
                            });
                        }

                        taken = Date.now() - time;
                        time = taken + time;
                        console.log(`指令 ${command.name} 成功載入! 載入耗時: ${taken}ms`);
                    }
                });
            });
            resolve({commands, events, queue});
        });
    }
}