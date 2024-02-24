const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const ytdl = require('ytdl-core');

module.exports = class Utils {
    constructor(main){
        this.main = main;
        this.emoji = {
            "play": "▶️",
            "pause": "⏸️",
            "stop": "⏹️",
            "queue": "📄",
            "success": "☑️",
            "repeat": "🔁",
            "error": "❌",
            "warning": "⚠️",
            "file": "📁",
            "update": "🚀",
            "time": "🕒",
            "this": "👉",
            "user": "🧑",
            "channel": "📡",
            "music": "🎵",
            "add": "➕",
            "highVolume": "🔊",
            "lowVolume": "🔈",
            "previous": "⏮️",
            "rewinding": "⏪",
            "fastForward": "⏩",
            "next": "⏭️",
            "refresh": "🔄",
            "wonderful": "💯",
            "thanks": "🥰",
            "left": "◀️",
            "button": "🖲️"
        }
        this.color = {
            "red": 0xFF0000,
            "green": 0x00FF00,
            "blue": 0x0000FF,
            "yellow": 0xFFFF00,
            "orange": 0xFFA500,
            "purple": 0x800080,
            "pink": 0xFFC0CB,
            "white": 0xFFFFFF,
            "black": 0x000000,
            "gray": 0x808080,
            "cyan": 0x00FFFF,
        }
    }
    getMusicQueue(interaction){
        const queue = this.main.bot.distube.getQueue(interaction);
        if(!queue) return false
        if(queue.songs.length === 0) return false;
        return queue;
    }

    //創建Embed範例信息模塊
    createEmbed(author, title, content, url, color, Footer, FooterURL, imgURL, Thumbnail){
        author = author || this.main.bot.user;
        title = title || `ReiNa Bot Rework`;
        color = color || `#0099ff`;
        url = url || `https://github.com/MCwindTIM/ReiNa-Bot-Rework`;
        Footer = Footer || `ReiNa By anesthesia_5542`;
		FooterURL = FooterURL || this.main.bot.user.avatarURL();
        imgURL = imgURL || null;
        Thumbnail = Thumbnail || null;

        let embed = new Discord.EmbedBuilder()
        .setAuthor({
            name: author.tag,
            iconURL: author.displayAvatarURL(),
        })
        .setColor(color)
        .setTitle(title)
        .setDescription(content)
        .setTimestamp()
        .setFooter({
            text: Footer,
            iconURL: FooterURL
        })
        if (!(url === "music")){
            embed.setURL(url);
        }
		if(imgURL){
			embed.setImage(imgURL);
        }
        if(Thumbnail){
            embed.setThumbnail(Thumbnail);
        }
        return embed;
    }

    getMusicEmbed(interaction, stop){
        if(stop) return this.createEmbed(interaction.user, `${this.emoji.music} 播放器控制菜單`, `${this.emoji.stop} **停止播放**`, null, this.color.orange);
        
        const updatedQueue = this.main.bot.distube.getQueue(interaction);

        let status = `**暫停中** ${this.emoji.pause}`;
        if(updatedQueue.playing) status = `**播放中 ${this.emoji.play}**`;
        const musicEmbed = this.createEmbed(interaction.user, `${this.emoji.music} ${status}`, `[${updatedQueue.songs[0].name}](${updatedQueue.songs[0].url})`, `music`, this.color.green, null, null, null, updatedQueue.songs[0].thumbnail);
        musicEmbed.addFields(
            {name: `點播用戶`, value: `<@${interaction.user.id}>`, inline: true},
            {name: `音樂時長`, value: `\`${updatedQueue.formattedCurrentTime} / ${updatedQueue.songs[0].formattedDuration}\``, inline: true},
            {name: `歌單時長`, value: `${updatedQueue.songs.length} 首歌 - \`${updatedQueue.formattedDuration}\``, inline: true},
            {name: `音量`, value: `\`${updatedQueue.volume}%\``, inline: true},
            {name: `循環播放`, value: `\`${updatedQueue.repeatMode === 0 ? `未啓用` :
                updatedQueue.repeatMode === 1 ? `單曲循環播放` : `清單循環播放`
            }\``, inline: true},
            {name: `效果器 </filter:1201735459642810378>`, value: `\`${updatedQueue.filters.names.join(', ') || 'Off'}\``},
            {name: `播放量`, value: `\`${updatedQueue.songs[0].views}\``}
        )
        return musicEmbed;
    }

    getQueueEmbed(interaction){
        const updatedQueue = this.main.bot.distube.getQueue(interaction);
        const q = updatedQueue.songs
            .map((song, i) => `${i === 0 ? '播放中:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
            .join('\n');
            return this.createEmbed(interaction.user, `${this.emoji.queue} | **播放清單**`, q, null, this.color.orange);
    }

    //Check Owner Perm
    checkOwner(uid){
        if(uid != this.main.config.ownerID){
            return false;
        }
        return true;
    }

    //set bot activity (status)
    //"COMPETING"	ActivityType.Competing	5
    //"CUSTOM"	    ActivityType.Custom	    4
    //"LISTENING"	ActivityType.Listening	2
    //"PLAYING"	    ActivityType.Playing	0
    //"STREAMING"	ActivityType.Streaming	1
    //"WATCHING"	ActivityType.Watching	3
    setActivity(ReiNa, status){
        // status ? ReiNa.bot.user.setActivity(status.string, {type: status.type}): status = { string: `${ReiNa.config.prefix}help | ReiNa Is Here! Nya~~~~`, type: 3};
        status ? ReiNa.bot.user.setActivity(status.string, {type: status.type}): status = { string: `更新中...部分功能未完善!`, type: 4};
        if(ReiNa.queue.size === 0){
            ReiNa.bot.user.setActivity(status.string, {type: status.type});
        }
    }

    //check user perm (allow eval command)
    checkUserPerm(uid){
        return this.main.config.adminID.includes(uid) || +uid === +this.main.config.ownerID ? true : false;
    }

    //Get time
    getTime(){
        const date_ob = new Date();
        const year = date_ob.getFullYear();
        const month = String(date_ob.getMonth() + 1).padStart(2, '0');
        const date = String(date_ob.getDate()).padStart(2, '0');
        const hours = String(date_ob.getHours()).padStart(2, '0');
        const minutes = String(date_ob.getMinutes()).padStart(2, '0');
        const seconds = String(date_ob.getSeconds()).padStart(2, '0');    
        return "[" + year + "-" + month + "-" + date + " | " + hours + ":" + minutes + ":" + seconds + "]";
    }

    load() {
        let commands = new Discord.Collection();
        let buttons = new Discord.Collection();
        let RESTcommands = [];
        const cFolders = `./Commands/`;
        const bFolders = `./Buttons`; 
        const commandFolders = fs.readdirSync(cFolders);
        const buttonFolders = fs.readdirSync(bFolders);
        

        return new Promise((resolve, reject) => {
            for (const folder of commandFolders) {
                const commandsPath = path.join(cFolders, folder);
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    const command = require(`../${filePath}`);
                    // Set a new item in the Collection with the key as the command name and the value as the exported module
                    if ('data' in command && 'run' in command) {
                        commands.set(command.data.name, command);
                        RESTcommands.push(command.data.toJSON());
                        console.log(`${this.main.util.emoji.file}${file}(${command.data.name})載入完成!`)
                    } else {
                        console.log(`${this.main.util.emoji.warning} 指令 ${filePath} 缺失 "data" 或 "execute" 属性.`);
                    }
                }
            }

            for (const folder of buttonFolders){
                const buttonsPath = path.join(bFolders, folder);
                const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
                for (const file of buttonFiles) {
                    const filePath = path.join(buttonsPath, file);
                    const button = require(`../${filePath}`);
                    if ('btn' in button && 'run' in button) {
                        buttons.set(button.btn.data.custom_id, button);
                        console.log(`${this.main.util.emoji.button}${file}(${button.btn.data.custom_id})載入完成!`)
                    } else {
                        console.log(`${this.main.util.emoji.warning} 指令 ${filePath} 缺失 "data" 或 "execute" 属性.`);
                    }
                }
            }

            //Command registration
            const rest = new Discord.REST().setToken(this.main.config.token);
            (async () => {
                try {
                    console.log(`${this.main.util.emoji.update} ${this.main.util.emoji.this} ${RESTcommands.length} 個 (/) 指令.`);
            
                    // The put method is used to fully refresh all commands in the guild with the current set
                    const data = await rest.put(
                        Discord.Routes.applicationCommands(this.main.config.clientId),
                        { body: RESTcommands },
                    );
            
                    console.log(`${this.main.util.emoji.success} ${this.main.util.emoji.this} ${data.length} 個 (/) 指令.`);
                } catch (error) {
                    // And of course, make sure you catch and log any errors!
                    console.error(error);
                }
            })();
            resolve({commands, buttons});
        });
    }

}