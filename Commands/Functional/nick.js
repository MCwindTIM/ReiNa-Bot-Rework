const Command = require('../../Core/command');

module.exports = class NickCommand extends Command {
    constructor(main){
        super(main, {
            name: "nick",
            category: "功能性",
            help: "更改用戶暱稱",
            args: [{
                name: "暱稱",
                desc: "希望更改的暱稱"
            }],
            caseSensitive: true
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let nick = "";
        if(args[0]) nick = args.join(" ");
        let setNick = this.main.util.createEmbed(message.author, null, `${message.author}, 嘗試設置暱稱為: **${nick}**`);
        try{
            await message.member.setNickname(nick, `ReiNa Bot Rework [Set Nick Name]`)
            await this.main.util.SDM(message.channel, setNick, message.author);
        }catch(e){
            if(e.length < 1023){
                let ErrorMSG = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 暱稱設置失敗`);
                ErrorMSG.addField('錯誤:', `\`\`\`${e}\`\`\``);
                await this.main.util.SDM(message.channel, ErrorMSG, message.author);
            }else{
                let ErrorMSG = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 暱稱設置失敗`);
                ErrorMSG.addField('錯誤:', `\`\`\`因錯誤信息超過1024個字元, 無法發送錯誤信息\n\n通常為權限問題 請檢查我擁有的權限是否可以更改暱稱以及需要更改暱稱的用戶的身份組權限是否比我高\`\`\``);
                await this.main.util.SDM(message.channel, ErrorMSG, message.author);
            }
        }
        }
}