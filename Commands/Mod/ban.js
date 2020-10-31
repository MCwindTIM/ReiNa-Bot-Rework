const Command = require('../../Core/command');

module.exports = class BanCommand extends Command {
    constructor(main){
        super(main, {
            name: "ban",
            category: "管理員限定",
            help: "請指定用戶離開伺服器並永久封禁",
            args: [{
                name: "用戶",
                desc: "@用戶"
            }]
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        if(message.member.hasPermission('BAN_MEMBERS') === true){
            ban.call(this, message, message.mentions.users.first());
        }else{
            let noPerm = this.main.util.createEmbed(message.author, null, `${message.author}, 你沒有權限 **BAN_MEMBERS**, 所以不可以封禁用戶!`)
            try{
                await this.main.util.SDM(message.channel, noPerm, message.author);
            }catch(e){}
        }
    }
}

async function ban(message, user){
	if(!user || user === this.main.bot.user){
        let MSG = this.main.util.createEmbed(message.author, null, `${message.author} 請指定要封禁的用戶!`);
        try{
            await this.main.util.SDM(message.channel, MSG, message.author);
        }catch(e){}
		 return;
    }
	  
	  
    message.guild.member(user).ban(`${message.author.tag} 使用封禁功能移除用戶!`).then(() => {
        let baned =  this.main.util.createEmbed(message.author, null, `${message.author} 用戶 **${user.tag}** 已經被移出伺服器並永久封禁!`);
        this.main.util.SDM(message.channel, baned, message.author);
    }).catch(e => {
        let fail = this.main.util.createEmbed(message.author, null, `${message.author} 無法封禁該用戶 (**${user.tag}**)!`);
        return this.main.util.SDM(message.channel, fail, message.author);
    });
    

}