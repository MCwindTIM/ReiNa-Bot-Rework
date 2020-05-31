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
		this.server = http.createServer((req, res) => {
			let path = url.parse(req.url).pathname;
			switch(path){
				case '/':
					fs.readFile(`${__dirname}/../WebSocket/Discord.html`, (err, data) => {
						if(err){
							res.writeHead(404);
							res.write('404 Server Error');
						}else{
							res.writeHead(200, {'Content-Type':'text/html'});
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
							res.writeHead(200, {'Content-Type': 'text/css'});
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

			this.bot.once('ready', () => {
				process.title = `${this.bot.user.tag} - Discord ReiNa Bot Rework`;
				console.log(`${this.bot.user.tag}上線!`);
				console.log(`上線耗時: ${Date.now() - finishLoad}ms`);
				this.loginTime = new Date().toString();
				this.bot.user.setActivity(`${this.config.prefix}help | ReiNa Is Here! Nya~~~~`, {type: 3});

				//MCwind Customize Interval function Delete If don't want
				let ReiNa = this;
				//Set Stat channel name (Time)
				const CurrentTime = require('../Customize/Event/CurrentTime.js');
				setInterval(() => CurrentTime.UpdateTime(ReiNa), 5000);

				//Set Stat channel name (user)
				const GuildUser = require('../Customize/Event/UpdateUser.js');
				setInterval(() => GuildUser.UpdateUser(ReiNa), 60000);

				//Check User Status (giving Role)
				const CheckUserStatus = require('../Customize/Event/CheckUserStatus.js');
				setInterval(() => CheckUserStatus.CheckUserStatus(ReiNa), 5000);

			});
			this.bot.on('disconnect', () => {
				lopginTime = Date.now();
			});
			this.bot.on('message', message => {
				if(!message.guild) return;
				if(message.author.bot){
					this.event.emit('DC_MSG', message);
					return;
				}else{
					this.event.emit('DC_MSG', message);
				}
				

				//Some MessageChecking for MCwind personal customize function (Maybe hardcoded) Delete function if making error
				const nHentai = require('../Customize/MessageChecking/nHentai.js');
				if(message.content.match(/(?<=[\[{])(https?:\/\/nhentai\.net\/g\/)?(\d+)\/?.*?(?=[}\]])/gi) && message.content.startsWith('[') && message.content.endsWith(']')){
					nHentai.run(this,message);
					console.log(`${nHentai.name} 指令被 ${message.author.tag}(${message.author.id}) 觸發!`);
				}else{if(message.content.match(/w(\d+)\/?.*?(?=[}\]])?(\d+)\/?/gi)){}else{if(message.channel.id === "655516899832233986"){message.delete().catch(console.log)}}};

				const wnacg = require('../Customize/MessageChecking/wnacg.js');
				if(message.content.match(/w(\d+)\/?.*?(?=[}\]])?(\d+)\/?/gi) && message.content.startsWith('[') && message.content.endsWith(']')){
					wnacg.run(this,message);
					console.log(`${wnacg.name} 指令被 ${message.author.tag}(${message.author.id}) 觸發!`);
				}else{if(message.content.match(/(?<=[\[{])(https?:\/\/nhentai\.net\/g\/)?(\d+)\/?.*?(?=[}\]])/gi)){}else{if(message.channel.id === "655516899832233986"){message.delete().catch()}}};

				const MSGsync = require('../Customize/MessageChecking/sync.js');
				if(message.guild.id === '407171840746848258') MSGsync.run(this, message);

				const CheckUserHuman = require('../Customize/MessageChecking/CheckUserHuman.js');
				if(message.channel.id === '702962295998906398' && message.content === `${this.config.prefix}驗證`){
					CheckUserHuman.run(this, message);
					console.log(`${CheckUserHuman.name} 指令被 ${message.author.tag}(${message.author.id}) 觸發!`);
				}
				if(message.channel.id === '702962295998906398' && message.content != `${this.config.prefix}驗證`){message.delete().catch()};

				const Sauce = require('../Customize/MessageChecking/PicSauce.js');
				if(message.content.includes("pixiv.net") || message.attachments.size > 0 && message.content.includes("來源")) {
					Sauce.PicFind(this, message);
					console.log(`${Sauce.name} 指令被 ${message.author.tag}(${message.author.id}) 觸發!`);
				}

				const ChatLog = require('../Customize/MessageChecking/ChatLog.js');
				if(!message.author.bot) ChatLog.log(`./ChatLog/${message.guild.id}/${message.channel.id}.log`, message);


				//MCwind Discord Server not allow invite link
				if(message.content.includes('discord.gg/' || 'discordapp.com/invite/') && message.guild.id === '398062441516236800'){
					message.delete().catch();
					let NotAllow = this.util.createEmbed(message.author, null, `這裡不允許發送Discord邀請連結!`, null, red);
					try{
						this.util.SDM(message.channel, NotAllow, message.author);
					}catch(e){}
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
					console.log(`${command.name} 指令被 ${message.author.tag}(${message.author.id}) 觸發!`);
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
				socket.emit('DC_MSG', {
					'Author': `${message.author.tag}`,
					'Date': `[${message.createdAt.toString().slice(16, 21)}]`,
					'Content': `${message.content}`,
					'Guild': `${message.guild.name}`,
					'Channel': `${message.channel.name}`
				});
			});
		});
	}
}