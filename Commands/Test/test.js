const Command = require('../../Core/command');

module.exports = class TestCommand extends Command {
    constructor(main){
        super(main, {
            name: "test",
            category: "測試",
            help: "測試指令!",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let test = this.main.util.createEmbed(message.author, null,`${message.author} 發送測試!`);
        try{
            await this.main.util.SDM(message.channel, test, message.author);
        } catch (e){}
    }
}