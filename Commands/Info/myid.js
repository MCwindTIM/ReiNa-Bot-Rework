const Command = require('../../Core/command');

module.exports = class TestCommand extends Command {
    constructor(main){
        super(main, {
            name: "myid",
            category: "信息",
            help: "獲取自己的Discord 16 位數字用戶ID",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let myid = this.main.util.createEmbed(message.author, null,`${message.author}, senpai! 你的Discord使用者ID是: ${message.author.id}`, null, 0xcc0000);
        try{
            await this.main.util.SDM(message.channel, myid, message.author);
        } catch (e){}
    }
}