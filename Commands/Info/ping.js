const Command = require('../../Core/command');

module.exports = class pingCommand extends Command {
    constructor(main){
        super(main, {
            name: "ping",
            category: "信息",
            help: "獲取我和Discord的網絡延遲",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let time = `${new Date().getTime() - message.createdTimestamp}ms`;
        let ping = this.main.util.createEmbed(message.author, null, `${message.author} senpai, 我花了 **${time}** 才收到你的信息\n\n我與DiscordAPI的網絡時延是: 🏓**${Math.floor(this.main.bot.ws.ping)}ms**`, null, 0xcc0000);
        try{
            await this.main.util.SDM(message.channel, ping, message.author);
        } catch (e){}
    }
}