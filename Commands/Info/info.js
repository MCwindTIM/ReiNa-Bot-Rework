const Discord = require('discord.js');
const os = require('os');
const request = require('request');
const nodeDiskInfo = require('node-disk-info');
module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('info')
		.setDescription('查看Bot系統信息'),
	async run(ReiNa, interaction) {
        await interaction.deferReply({ ephemeral: true });
        let cpuinfo = os.cpus();
        let oss = os.uptime();
        oss = Math.floor(oss);
        let osdays = Math.floor(oss / 86400);
        oss %= 86400;
        let oshours = Math.floor(oss / 3600);
        oss %= 3600;
        let osmins = Math.floor(oss / 60);
        oss %= 60;
        const disks = nodeDiskInfo.getDiskInfoSync();
        const diskInfo = async (disks) => {
            let diskBlocks = 0;
            let diskUsed = 0;
            for (let disk of disks){
                diskBlocks += disk.blocks
                diskUsed += disk.used
            }
            return (`${Number.parseInt(diskUsed/1024/1024/1024)}/${Number.parseInt(diskBlocks/1024/1024/1024)} GB`);
        }
        const pattern = {'Mon':'(一)','Tue':'(二)','Wed':'(三)','Thu':'(四)','Fri':'(五)','Sat':'(六)','Sun':'(日)','Jan':'一月','Feb':'二月','Mar':'三月', 'Apr':'四月', 'May':'五月', 'Jun':'六月', 'Jul':'七月', 'Aug':'八月', 'Sep':'九月', 'Oct':'十月', 'Nov':'十一月', 'Dec':'十二月', '(China Standard Time)': ''};
        let _guptime = ReiNa.loginTime.replace(/(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?|\(China Standard Time\))/g, m => pattern[m]);
        let totalSeconds = (ReiNa.bot.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        totalSeconds %= 60;
        let seconds = Math.floor(totalSeconds % 60);
        totalSeconds %= 60;
        let uptime = `${days} 天, ${hours} 小時, ${minutes} 分鐘, ${seconds} 秒`;
        let osuptime = `${osdays} 天, ${oshours} 小時, ${osmins} 分鐘, ${oss} 秒`
        let time = `${new Date().getTime() - interaction.createdTimestamp}ms`;
        let infoMSG = ReiNa.util.createEmbed(interaction.user, null, `${interaction.user} senpai, 我花了**${time}** 才收到你的信息並回覆\nDiscord API WebSocket Latency: ${ReiNa.bot.ws.ping}ms`, null, 0xcc0000)
        infoMSG
        .addFields(
            {name: '系統內容', value: `**${os.type()} | ${os.release()} | ${os.platform()}**`, inline: true},
            {name: '系統CPU型號', value: `**${cpuinfo[0].model}**`, inline: true},
            {name: '系統CPU現時速度', value: `**${cpuinfo[0].speed / 1000}GHz**`, inline: true},
            {name: '系統記憶體用量', value: `**${((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB**`, inline: true},
            //.addField('系統記憶體用量', `**${os.totalmem() - os.freemem()} / ${os.totalmem()} Byte | ${((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB**`)
            {name: '系統硬碟用量', value: `**${await diskInfo(disks)}**`, inline: true},
            {name: '系統運作時間', value: `**${osuptime}**`, inline: true},
            {name: '程序開始運作時間', value: `**${_guptime}**`, inline: true},
            {name: 'Bot上線運行時間', value: `**${uptime}**`, inline: true},
            {name: 'Discord JS 版本', value: `**v${require('discord.js').version}**`, inline: true},
            {name: 'Node JS 版本', value: `**${process.version}**`, inline: true},
            {name: '服務數量', value: `**${ReiNa.bot.guilds.cache.size}**個伺服器, **${ReiNa.bot.channels.cache.size}**個頻道, **${ReiNa.bot.users.cache.size}**個用戶!`, inline: true}
        )
        await request.get('https://api.ipify.org/?format=json', {}, async (err, res, body) => {
            if(!err){
                infoMSG.addFields({name: 'IPv4 IP Address', value: `${JSON.parse(body).ip}`, inline: true});
            }
            
		    return await interaction.editReply({ embeds: [infoMSG]});
        })
	},
};