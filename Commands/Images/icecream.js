const Command = require('../../Core/command');

module.exports = class ImageCommand extends Command {
    constructor(main){
        super(main, {
            name: "icecream",
            category: "圖片",
            help: "發送冰淇淋圖片[Gif] NSFW",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let icecream = this.main.util.createEmbed(message.author, null,`${message.author} 表示!`);
        icecream.setImage(`https://duckduckdoc.tk/wp-content/uploads/drive/ReiNa-Bot-Rework/Images/ice_cream.gif`);
        try{
            await this.main.util.SDM(message.channel, icecream, message.author);
        } catch (e){}
    }
}