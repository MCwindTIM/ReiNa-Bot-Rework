const Command = require('../../Core/command');
const request = require('request');

module.exports = class R6Command extends Command {
    constructor(main){
        super(main, {
            name: "apex",
            category: "信息",
            help: "查詢apex 玩家信息!",
            args: [{
                name: "平台",
                desc: "PC / PS4 / X1"
            },
            {
                name: "玩家名稱",
                desc: "玩家名稱字串"
            }],
            caseSensitive: true
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let api = `${this.main.config.apexAPI}`;
        if(args.length === 2 && args[0] === "PC" || args[0] === "PS4" || args[0] === "X1"){
            request.get.call(this, `https://api.mozambiquehe.re/bridge?version=4&platform=${args[0]}&player=${args[1]}&auth=${api}`, {},
            async (error, response, body) => {
            if(response.statusCode == 200){
                var obj = await JSON.parse(body);
                let player = obj.global;
                        var rank = "";
    
                        var rankpic = player.rank.rankImg;

                        let playerInfo = await this.main.util.createEmbed(message.author, `APEX 玩家查詢(=ﾟωﾟ)ﾉ`, `${message.author} Senpai, 你請求的 apex 玩家資料找到了~`, null, `'#0099ff'`, null, null, null, rankpic);
                        playerInfo
                            .addField('玩家ID: ', player.name, true)
                            .addField('玩家UID: ', player.uid, true)
                            .addField('玩家等級: ', player.level, true)
                            .addField('平台: ', player.platform, true)
                            .addField('現時積分: ', player.rank.rankScore, true)
                            .addField('玩家排位: ', player.rank.rankName, true)
                            .addField('玩家KD: ', obj.total.kd.value, true)
                            .addField('擊殺數: ', obj.total.kills.value, true)
                        if(obj.total.revives){
                            playerInfo.addField('救人數: ', obj.total.revives.value, true)
                        }
                        if(obj.total.wins_season_3){
                            playerInfo.addField('賽季3勝場: ', obj.total.wins_season_3.value, true)
                        }
                        if(obj.total.kills_season_4){
                            playerInfo.addField('賽季3殺人數: ', obj.total.kills_season_4.value, true)
                        }
                        if(obj.total.wins_season_4){
                            playerInfo.addField('賽季4勝場: ', obj.total.wins_season_4.value, true)
                        }
                        if(obj.total.kills_season_4){
                            playerInfo.addField('賽季4殺人數: ', obj.total.kills_season_4.value, true)
                        }
                        if(obj.total.wins_season_5){
                            playerInfo.addField('賽季5勝場: ', obj.total.wins_season_5.value, true)
                        }
                        if(obj.total.kills_season_5){
                            playerInfo.addField('賽季5殺人數: ', obj.total.kills_season_5.value, true)
                        }
                        playerInfo.addField('玩家最後一次ban原因: ', player.bans.last_banReason, true);
                        try {
                            await this.main.util.SDM(message.channel, playerInfo, message.author);
                        }   catch (e) {}
            }else{
						let playerNotFound = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} Senpai, 沒有找到該位玩家欸!\n\n請檢查輸入是否正確 平台: *${args[0]}* 玩家ID *${args[1]}*`, null, `#0099ff`);
                        try {
                            await this.main.util.SDM(message.channel, playerNotFound, message.author);
                        }   catch (err) {}
			}
            })
        }
        else{
            let wronginfo = await this.main.util.createEmbed(message.author, 'ReiNa Bot Rework 錯誤', `請輸入正確資料`, null, 0xcc0000);
            wronginfo.addField('使用方法: ', "rn!apex [平台] [玩家UID]\n平台輸入 `PC` `PS4` `X1` 分別為Uplay, PlayStationNetwork, Xbox");
            try {
                this.main.util.SDM(message.channel, wronginfo, message.author);
            }   catch (e) {}
        }
    }
}