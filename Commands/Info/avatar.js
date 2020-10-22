const Command = require('../../Core/command');

module.exports = class avatarCommand extends Command {
    constructor(main){
        super(main, {
            name: "avatar",
            category: "信息",
            help: "返回用戶頭像",
            args: [{
                name: "[可選填]@用戶",
                desc: "可以返回該用戶的使用者頭像 如果該值為空, 將返回使用者頭像"
            }]
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let user = message.mentions.users.first();
        if(!user) user = message.author;

        let avatarMSG = await this.main.util.createEmbed(message.author, `ReiNa Bot Rework 用戶頭像`, `${message.author} Senpai, 這是<@${user.id}>的使用者頭像!`, user.avatarURL({format: "png", size: 4096}), 0xcc0000);
        await avatarMSG.setImage(user.avatarURL({format: "png", size: 4096}));
        try{
            await this.main.util.SDM(message.channel, avatarMSG, message.author);
        }catch(e){}
    }
}