const Command = require('../../Core/command');
const request = require('request');
const pattern = {'Mon':'(一)','Tue':'(二)','Wed':'(三)','Thu':'(四)','Fri':'(五)','Sat':'(六)','Sun':'(日)','Jan':'一月','Feb':'二月','Mar':'三月', 'Apr':'四月', 'May':'五月', 'Jun':'六月', 'Jul':'七月', 'Aug':'八月', 'Sep':'九月', 'Oct':'十月', 'Nov':'十一月', 'Dec':'十二月', '(China Standard Time)': '', '(Hong Kong Standard Time)': '(香港標準時間)'};
module.exports = class HololiveYTLive extends Command {
    constructor(main){
        super(main, {
            name: "live",
            category: "信息",
            help: "查詢HoloLive現時正在直播的頻道",
            args: [{
                name: "[可選填] tt",
                desc: "如果輸入此字串, 將獲得直播時間表!"
            }]
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        if(!args || args[0] != "tt"){
            request.get('https://holo.dev/api/v1/lives/current', {},
            async (error, response, raw) => {
                if(response.statusCode != 200){
                    let error_404 = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author}, Hololive Dev Api 沒有回應, 請稍後再試!`);
                    await this.main.util.SDM(message.channel, error_404, message.author);
                    return;
                }
                var obj = JSON.parse(raw);
                let livemsg = this.main.util.createEmbed(message.author, `Hololive Dev Api 查詢`, `${message.author}, 你要求的資訊找到了! 下方是 Hololive 正在直播的信息!`, 'https://schedule.hololive.tv/');
                obj.lives.forEach(live => {
                    if(live.platform == "youtube"){
                        let time = new Date(live.start_at).toString().replace(/(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?|\(China Standard Time\)|\(Hong Kong Standard Time\))/g, m => pattern[m]);;
                    livemsg.addField(`:red_circle: ${live.title}`, `在 ${time} 開始直播! \n[直播連結](https://youtube.com/watch?v=${live.room}) [頻道連結](https://youtube.com/channel/${live.channel})`, false);
                    }
                    });
                await this.main.util.SDM(message.channel, livemsg, message.author);
            });
        }

        if(args[0] === "tt"){
            request.get('https://holo.dev/api/v1/lives/scheduled', {},
            async (error, response, raw) => {
                if(response.statusCode != 200){
                    let error_404 = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author}, Hololive Dev Api 沒有回應, 請稍後再試!`);
                    await this.main.util.SDM(message.channel, error_404, message.author);
                    return;
                }
                var obj = JSON.parse(raw);
                let livemsg = this.main.util.createEmbed(message.author, `Hololive Dev Api 查詢`, `${message.author}, 你要求的資訊找到了! 下方是 Hololive 直播的時間表 (只會顯示最近10個直播預定)!`, 'https://schedule.hololive.tv/');
                obj.lives.slice(0, 10).forEach(live => {
                    if(live.platform == "youtube"){
                        let time = new Date(live.start_at).toString().replace(/(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?|\(China Standard Time\)|\(Hong Kong Standard Time\))/g, m => pattern[m]);;
                        livemsg.addField(`:bell: ${live.title}`, `在 ${time} 開始直播! \n[直播連結](https://youtube.com/watch?v=${live.room}) [頻道連結](https://youtube.com/channel/${live.channel})`, false);
                    }
                    });
                await this.main.util.SDM(message.channel, livemsg, message.author);
            });
        }
    }


}