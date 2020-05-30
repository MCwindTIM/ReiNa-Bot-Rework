const Command = require('../../Core/command');
const {spawn} = require('child_process');

module.exports = class RestartCommand extends Command {
    constructor(main){
        super(main, {
            name: "restart",
            category: "擁有者限定",
            help: "重新啟動ReiNa Bot Rework",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        if(this.main.util.checkOwner(message.author)){
            let restart = this.main.util.createEmbed(message.author, null, `重新啟動中... :wave:`);
            try{
                await this.main.util.SDM(message.channel, restart, message.author);
                process.exit()
            }catch(e){}
        }else{
            let noPerm = this.main.util.createEmbed(message.author, null, `${message.author}, 你的權限不足! 無法重新啟動 ReiNa Bot Rework!`);
            try{
                this.main.util.SDM(message.channel, noPerm, message.author);
            }catch(e){}
        }
    }
}