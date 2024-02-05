const Command = require('../../Core/command');

module.exports = class EbaseCommand extends Command {
    constructor(main){
        super(main, {
            name: "ebase",
            category: "功能性",
            help: "加密信息",
            args: [],
            caseSensitive: true
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let mString = args.join(" ");
        if(mString === ''){
            let NTE = await this.main.util.createEmbed(message.author, `ReiNa Bot Rework 加密信息`, `${message.author}, 請輸入需要加密的字串!`);
            try{
                await this.main.util.SDM(message.channel, NTE, message.author);
            }catch(e){}
            return;
        }
        let tString = Buffer.from(mString).toString('base64');
        let doneMSG = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 加密信息`, tString);
        try{
            this.main.util.SDM(message.channel, doneMSG, message.author);
        }catch(e){}
    }
}