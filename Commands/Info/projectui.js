const Command = require('../../Core/command');

module.exports = class TestCommand extends Command {
    constructor(main){
        super(main, {
            name: "projectui",
            category: "信息",
            help: "獲取Project UI 的 Github 連結",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let projectui = this.main.util.createEmbed(message.author, `Github:ProjectUI`, `${message.author}, senpai! 這裡是**ProjectUI**的Github連結!\n\n請點擊上方藍色標題導向到**ProjectUI**的Github專案`, `https://github.com/MCwindTIM/ProjectUI`);
        try{
            await this.main.util.SDM(message.channel, projectui, message.author);
        } catch (e){}
    }
}