const Command = require('../../Core/command');
const request = require('request');

module.exports = class Invite extends Command {
    constructor(main){
        super(main, {
            name: "invite",
            category: "信息",
            help: "傳送邀請連結",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
            let invitemsg = this.main.util.createEmbed(message.author, null, `${message.author}, 我的邀請連結是 https://discord.com/api/oauth2/authorize?client_id=${this.main.bot.user.id}&permissions=8&scope=bot`);
            await this.main.util.SDM(message.channel, appmsg, message.author);
    }
}