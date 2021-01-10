const Command = require('../../Core/command');

module.exports = class ImageCommand extends Command {
    constructor(main){
        super(main, {
            name: "dd",
            category: "圖片",
            help: "neeeeeeeeeeeeeeeeeEEEEEEE",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let yes = this.main.util.createEmbed(message.author, null,`${message.author} 表示!`);
        yes.setImage(`https://duckduckdoc.tk/wp-content/uploads/drive/ReiNa-Bot-Rework/Images/dd.jpg`);
        try{
            await this.main.util.SDM(message.channel, yes, message.author);
        } catch (e){}
    }
}