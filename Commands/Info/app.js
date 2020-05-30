const Command = require('../../Core/command');
const request = require('request');

module.exports = class AppCommand extends Command {
    constructor(main){
        super(main, {
            name: "app",
            category: "信息",
            help: "請求最新桌面應用程式版本",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        request.get.call(this, 'https://duckduckdoc.tk/wp-content/uploads/drive/ReiNa-RPC(KitIsGAY)_x64.json', {},
        async (error, response, raw) => {
            var obj = JSON.parse(raw);
            var version = obj.version;
            
            let sucess = this.main.util.createEmbed(message.author, null, `${message.author}, 你要求的**ReiNa-RPC(KitIsGAY)_x64.exe**找到了! 請點擊下方連結下載檔案!\n\n <https://duckduckdoc.tk/wp-content/uploads/drive/ReiNa-RPC(KitIsGAY)_x64@${version}.exe>\n\n現時最新版本: **${version}**`);
            try{
                await this.main.util.SDM(message.channel, sucess, message.author);
            }catch(e){
                let errorMSG = this.main.util.createEmbed(message.author, null, `${message.author}, 發生錯誤啦 (對象伺服器可能下線了?)`);
                await this.main.util.SDM(message.channel, errorMSG, message.author);
            }
        });
    }
}