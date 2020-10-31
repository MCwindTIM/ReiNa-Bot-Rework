const Command = require('../../Core/command');

module.exports = class KickCommand extends Command {
    constructor(main){
        super(main, {
            name: "kick",
            category: "管理員限定",
            help: "請指定用戶離開伺服器",
            args: [{
                name: "用戶",
                desc: "@用戶"
            }]
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        if(message.member.hasPermission('KICK_MEMBERS') === true){
            kick.call(this, message, message.mentions.users.first());
        }else{
            let noPerm = this.main.util.createEmbed(message.author, null, `${message.author}, 你沒有權限 **KICK_MEMBERS**, 所以不可以踢除用戶!`)
            try{
                await this.main.util.SDM(message.channel, noPerm, message.author);
            }catch(e){}
        }
    }
}

async function kick(message, user){
	if(!user || user === this.main.bot.user){
        let MSG = this.main.util.createEmbed(message.author, null, `${message.author} 請指定要踢除的用戶!`);
        try{
            await this.main.util.SDM(message.channel, MSG, message.author);
        }catch(e){}
		 return;
    }
	  
	  
    message.guild.member(user).kick(`${message.author.tag} 使用踢除功能移除用戶!`).then(() =>{ 
        let kicked = this.main.util.createEmbed(message.author, null, `${message.author} 用戶 **${user.tag}** 已經被移出伺服器!`);
        this.main.util.SDM(message.channel, kicked, message.author);
    }).catch(e => {
        let fail = this.main.util.createEmbed(message.author, null, `${message.author} 無法踢除該用戶 (**${user.tag}**)!`);
        return this.main.util.SDM(message.channel, fail, message.author);
    });
    
}