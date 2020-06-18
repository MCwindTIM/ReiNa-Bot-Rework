const Command = require('../../Core/command');
const request = require('request');

module.exports = class KitisgayCommand extends Command {
    constructor(main){
        super(main, {
            name: "kitisgay",
            category: "信息",
            help: "返回Kitisgay應用程式",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        request.get('https://duckduckdoc.tk/wp-content/uploads/drive/ReiNa-RPC(KitIsGAY)_x64.json', {},
        async (error, response, raw) => {
            if(response.statusCode != 200){
                let error_404 = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author}, 伺服器暫時不在線, 請稍後再試!`);
                await this.main.util.SDM(message.channel, error_404, message.author);
                return;
            }
            var obj = JSON.parse(raw);
            var version = obj.version;
            
            let appmsg = this.main.util.createEmbed(message.author, null, `${message.author}, 你要求的**ReiNa-RPC(KitIsGAY)_x64.exe**找到了! 請點擊下方連結下載檔案!\n\n <https://duckduckdoc.tk/wp-content/uploads/drive/ReiNa-RPC(KitIsGAY)_x64@${version}.exe>\n\n現時最新版本: **${version}**`);
            await this.main.util.SDM(message.channel, appmsg, message.author);
        });
    }
}