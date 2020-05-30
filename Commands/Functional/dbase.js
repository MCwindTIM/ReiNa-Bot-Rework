const Command = require('../../Core/command');

module.exports = class DbaseCommand extends Command {
    constructor(main){
        super(main, {
            name: "dbase",
            category: "功能性",
            help: "解密信息",
            args: [],
            caseSensitive: true
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let mString = args.join(" ");
        let tString = Buffer.from(mString, 'base64').toString();
        let doneMSG = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 解密信息`, tString);
        try{
            this.main.util.SDM(message.channel, doneMSG, message.author);
        }catch(e){}
    }
}