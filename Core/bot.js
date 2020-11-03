const Discord = require('discord.js');
const Config = require('./config');
const Util = require('./util');
const http = require('http');
const EventEmitter = require('events').EventEmitter;
const url = require('url');
const fs = require('fs');
const io = require('socket.io');


module.exports = class ReiNaRework {
	constructor(option) {
		process.on('uncaughtException', error => {
			console.error('Unhandled Exception:', error);
		});
		process.on('unhandledRejection', error => {
			console.error('Unhandled promise rejection:', error);
		});
		this.server = http.createServer((req, res) => {
			let path = url.parse(req.url).pathname;
			switch(path){
				case '/':
					fs.readFile(`${__dirname}/../WebSocket/Discord.html`, (err, data) => {
						if(err){
							res.writeHead(404);
							res.write('404 Server Error');
						}else{
							res.writeHead(200, {'Content-Type':'text/html', 'charset': 'utf-8'});
							res.write(data, 'utf8');
						}
						res.end();
					});
					break;
				case '/style.css':
					fs.readFile(`${__dirname}/../WebSocket/style.css`, (err, data) => {
						if(err){
							res.writeHead(404);
						}else{
							res.writeHead(200, {'Content-Type': 'text/css', 'charset': 'utf-8'});
							res.write(data, 'utf8');
						}
						res.end();
					})
					break;
				default:
					res.writeHead(404);
					res.write('404 Server Error');
					res.end();
					break;
			}
		});;
		this.server_io = require('socket.io');
		this.event = new EventEmitter();
		this.event.setMaxListeners(0);
		this.bot = new Discord.Client();
		this.config = new Config(option);
		this.util = new Util(this);
		this.loginTime = "";
		this.util.load().then(data => {
			this.commands = data.commands;
			this.events = data.events;
			this.queue = data.queue;
			this.musictimer = data.musictimer;
			let finishLoad = Date.now();

			//Set Customize Event's Variable
			this.WeatherWarningMSG = [];

			this.bot.once('ready', () => {
				process.title = `${this.bot.user.tag} - Discord ReiNa Bot Rework`;
				console.log(`${this.bot.user.tag}上線!`);
				console.log(`上線耗時: ${Date.now() - finishLoad}ms`);
				this.loginTime = new Date().toString();
				this.util.setActivity(this);
				setInterval(() => {
					this.util.setActivity(this);
				}, 60000);

				//MCwind Customize Interval function Delete If don't want

				//Set Stat channel name (user)
				const GuildUser = require('../Customize/Event/UpdateUser.js');
				setInterval(() => GuildUser.UpdateUser(this), 60000);

				//Check User Status (giving Role)
				const CheckUserStatus = require('../Customize/Event/CheckUserStatus.js');
				setInterval(() => CheckUserStatus.CheckUserStatus(this), 5000);

				//WeatherWarning
				const WeatherWarning = require('../Customize/Event/WeatherWarning.js');
				setInterval(() => WeatherWarning.CheckWeatherWarning(this), 5000);

			});
			this.bot.on('disconnect', () => {
				lopginTime = Date.now();
			});
			this.bot.on('message', message => {
				if(!message.guild && message.author != this.bot.user) {
					try{
						if(message.attachments.size > 0){
							let i;
							for (i=0;i<message.attachments.size;i++){
									if(message.content){
										this.bot.users.cache.get(this.config.ownerID).send(`**${message.author.tag}**:\n${message.attachments.array()[i].url}\n${message.content}`);
									}else{
										this.bot.users.cache.get(this.config.ownerID).send(`**${message.author.tag}**:\n${message.attachments.array()[i].url}`);
									}
							}
						}else{
							this.bot.users.cache.get(this.config.ownerID).send(`${message.author.tag}:\n${message}`);
						}
					}catch(e){
						console.log(e);
					}
					return;
				};
				if(message.author.bot){
					this.event.emit('DC_MSG', message);

					//Customize - Check lastfm bot embeds
					const lastfm = require('../Customize/MessageChecking/lastfm.js');
					//check lastfm bot message embed
					if(message.author.id === '493845886166630443' || message.author.id === '356268235697553409' && message.guild.id === "398062441516236800"){
						if(!message.embeds[0]) return;
						if(message.embeds[0].author.name.startsWith('Now playing -')){
						lastfm.run(this, message);
						console.log(`${this.util.color.FgYellow}${this.util.getTime()}${this.util.color.Reset} ${this.util.color.FgCyan}${lastfm.name}${this.util.color.Reset} 指令被 ${message.author.tag}(${message.author.id}) 觸發!`);
						}
					}
					return;
				}else{
					this.event.emit('DC_MSG', message);
				}
				

				//Some MessageChecking for MCwind personal customize function (Maybe hardcoded) Delete function if making error
				const nHentai = require('../Customize/MessageChecking/nHentai.js');
				const wnacg = require('../Customize/MessageChecking/wnacg.js');
				if(message.content.match(/(?<=[\[{])(https?:\/\/nhentai\.net\/g\/)?(\d+)\/?.*?(?=[}\]])/gi) && message.content.startsWith('[') && message.content.endsWith(']')){
					nHentai.run(this, message);
					console.log(`${this.util.color.FgYellow}${this.util.getTime()}${this.util.color.Reset} ${this.util.color.FgCyan}${nHentai.name}${this.util.color.Reset} 指令被 ${message.author.tag}(${message.author.id}) 觸發!`);
				}else{
					if(message.content.match(/w(\d+)\/?.*?(?=[}\]])?(\d+)\/?/gi) && message.content.startsWith('[') && message.content.endsWith(']')){
						wnacg.run(this, message);
						console.log(`${this.util.color.FgYellow}${this.util.getTime()}${this.util.color.Reset} ${this.util.color.FgCyan}${wnacg.name}${this.util.color.Reset} 指令被 ${message.author.tag}(${message.author.id}) 觸發!`);
					}else{
						if(message.channel.id === "655516899832233986"){
							message.delete().catch(console.log)
						}
					}
				};

				const MSGsync = require('../Customize/MessageChecking/sync.js');
				if(message.guild.id === '407171840746848258') MSGsync.run(this, message);

				const CheckUserHuman = require('../Customize/MessageChecking/CheckUserHuman.js');
				if(message.channel.id === '702962295998906398' && message.content === `${this.config.prefix}驗證`){
					CheckUserHuman.run(this, message);
					console.log(`${this.util.color.FgYellow}${this.util.getTime()}${this.util.color.Reset} ${this.util.color.FgCyan}${CheckUserHuman.name}${this.util.color.Reset} 指令被 ${message.author.tag}(${message.author.id}) 觸發!`);
				}
				if(message.channel.id === '702962295998906398' && message.content != `${this.config.prefix}驗證`){message.delete().catch()};

				const Sauce = require('../Customize/MessageChecking/PicSauce.js');
				if(message.content.includes("pixiv.net") || message.attachments.size > 0 && message.content.includes("來源")) {
					Sauce.PicFind(this, message);
					console.log(`${this.util.color.FgYellow}${this.util.getTime()}${this.util.color.Reset} ${this.util.color.FgCyan}${Sauce.name}${this.util.color.Reset} 指令被 ${message.author.tag}(${message.author.id}) 觸發!`);
				}

				const ChatLog = require('../Customize/MessageChecking/ChatLog.js');
				if(!message.author.bot) ChatLog.log(`./ChatLog/${message.guild.id}/${message.channel.id}.log`, message);

				//MCwind Discord Server not allow invite link
				if(message.guild.id === '398062441516236800'){
					if(message.content.toLowerCase().includes('discord.gg/') || message.content.toLowerCase().includes('discordapp.com/invite/') || message.content.toLowerCase().includes('discord.com/invite/')){
						message.delete().catch();
						let NotAllow = this.util.createEmbed(message.author, null, `這裡不允許發送Discord邀請連結!`, null, 0xcc0000);
						try{
							this.util.SDM(message.channel, NotAllow, message.author);
						}catch(e){}
					}
				}

				//End of MCwind personal customize function

				let prefix = this.config.prefix;
				let textPrefix = message.guild.me.displayName;
				if(prefix) textPrefix = new RegExp(`^${prefix.replace(/[-[\]{}()*+?.,\\^$|#\s]/gi, '\\$&')}|<@\!?${this.bot.user.id}>|@${textPrefix}`);
				else{
					textPrefix = new RegExp(`<@\!?${this.bot.user.id}>|@${textPrefix}`);
					prefix = `@${this.bot.user.username}`;
				}
				if(!message.content.match(textPrefix)) return;

				let content = message.content.replace(textPrefix, '').trim();
				let cleanContent = message.cleanContent.replace(textPrefix, '').trim();
				let args = content.split(' ');

				let command = this.commands.get(args[0].toLowerCase());
				if(command) {
					if(command.cleanContent){
						args = cleanContent;
						if(!command.caseSensitive) args = args.toLowerCase();
						args = args.split(' ');
					}
					else if(!command.caseSensitive){
						args = content.toLowerCase().split(' ');
					}
					command.run(message, args.slice(1), prefix);
					command.timerUsed++;
					console.log(`${this.util.color.FgYellow}${this.util.getTime()}${this.util.color.Reset} ${this.util.color.FgCyan}${command.name}${this.util.color.Reset} 指令被 ${message.author.tag}(${message.author.id}) 觸發!`);
				}

				
			});
			this.bot.on('guildMemberAdd', (member) => {
				//MCwind Customize Event method
				const guildMemberAdd = require('../Customize/Event/guildMemberAdd.js');
				guildMemberAdd.sendWelcomeMessage(member);
			});
			this.bot.on('guildMemberRemove', (member) => {
				//MCwind Customize Event method
				const guildMemberRemove = require('../Customize/Event/guildMemberRemove.js');
				guildMemberRemove.sendByeMessage(member);
			});
			this.bot.on('voiceStateUpdate', (oldState, newState) => {
				const serverQueue = this.queue.get(newState.guild.id);
				if(!serverQueue) return;
				if(!newState.channelID){
					let disconnect = this.util.createEmbed(null, null, `Senpai, 我被管理員中斷語音連接了! 如果下次需要我的時候再叫我吧！\n\n\n**此信息將會在5秒後自動刪除**\n`, null, 0xcc0000);
					this.queue.get(oldState.guild.id).textChannel.send(disconnect)
					.then(msg => {
						msg.delete({timeout: 5000}).catch(console.error);
					}).catch();
					this.util.setActivity(this);
					try{
						this.queue.delete(oldState.guild.id);
						this.musictimer.delete(oldState.guild.id);
					}catch(e){}
					return;
				}
				if(oldState.channelID != newState.channelID){
					try{
						this.queue.get(newState.guild.id).voiceChannel = newState.channel;
					}catch(e){}
				}
			})
			
			this.bot.login(this.config.token).catch(console.log);
		});

		//Start HTTP Server
		let Port = this.config.Port || 3000;
		this.server.listen(Port, function(){
			console.log(`程式正在監聽端口${Port}的連線!`);
		});
		
		this.server_io = io.listen(this.server);
		this.server_io.sockets.on('connection', socket => {
			this.event.on('DC_MSG', message => {
				let attachmentURL = [];
				if(message.attachments.size > 0){
					
					for (let i=0; i<message.attachments.size; i++){
						attachmentURL.push(`${message.attachments.array()[i].url}`);
					}
				}
				socket.emit('DC_MSG', {
					'Author': `${this.util.htmlEscape(message.author.tag)}`,
					'Date': `[${this.util.htmlEscape(message.createdAt.toString().slice(16, 21))}]`,
					'Content': `${this.util.htmlEscape(message.content)}`,
					'Guild': `${this.util.htmlEscape(message.guild.name)}`,
					'Channel': `${this.util.htmlEscape(message.channel.name)}`,
					'Attachment': attachmentURL,
					'fileString': '附加檔案'
				});
			});
		});

		//MCwind Customize Event
		this.event.on('WWarning', async warningMSG => {
			this.WeatherWarningMSG = warningMSG;
			let Warning = this.util.createEmbed(null, `ReiNa Bot Rework 天氣警告`, `自動警告 ${new Date()}`);
			for(let i = 0; i < warningMSG.length; i ++){
			Warning.addField(`信息${i + 1}`, warningMSG[i]);
			}
			 await this.util.SDM(this.bot.channels.cache.get('741890517050196058'), Warning, this.bot.user);
		});
	}

}