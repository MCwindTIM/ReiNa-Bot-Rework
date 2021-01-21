const Command = require('../../Core/command');
const request = require('request');

module.exports = class DivisionCommand extends Command {
    constructor(main) {
        super(main, {
            name: "division",
            category: "信息",
            help: "查詢 Tom Clancy's The Division 2 玩家信息!",
            args: [{
                    name: "平台",
                    desc: "uplay / psn / xbl"
                },
                {
                    name: "玩家名稱",
                    desc: "玩家名稱字串"
                }
            ],
            caseSensitive: true
        });
    }
    async run(message, args, prefix) {
        message.delete().catch();
        let api = `${this.main.config.DivisionAPI}`;
        if (args.length === 2 && args[0] === "uplay" || args[0] === "psn" || args[0] === "xbl") {
            const options = {
                url: `https://public-api.tracker.gg/v2/division-2/standard/profile/uplay/${args[1]}`,
                headers: {
                    'TRN-Api-Key': api
                }
            };
            request(options, async (error, response, body) => {
                if (response.statusCode == 200) {
                    var obj = await JSON.parse(body);
                    if(obj.errors){
                        if (obj.errors.code && obj.errors.code === "CollectorResultStatus::NotFound") {
                            let playerNotFound = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} Senpai, 沒有找到該位玩家欸!\n\n請檢查輸入是否正確 平台: *${args[0]}* 玩家ID *${args[1]}*`, null, `#0099ff`);
                            try {
                                await this.main.util.SDM(message.channel, playerNotFound, message.author);
                            } catch (err) {}
                            return
                        }else{
                            return
                        }
                    }
                    let playerAvatar = obj.data.platformInfo.avatarUrl;
                    let playerStats = obj.data.segments[0].stats;
                    let playerInfo = await this.main.util.createEmbed(message.author, `Division 玩家查詢(=ﾟωﾟ)ﾉ`, `${message.author} Senpai, 你請求的 Division 玩家資料找到了~`, null, `'#0099ff'`, null, null, null, playerAvatar);
                    playerInfo
                        .addField('玩家ID: ', obj.data.platformInfo.platformUserId, true)
                        .addField('玩家UID: ', obj.data.platformInfo.platformUserIdentifier, true)
                        .addField('玩家等級: ', playerStats.highestPlayerLevel.value, true)
                        .addField('平台: ', obj.data.platformInfo.platformSlug, true)
                        .addField('經驗總值: ', playerStats.xPTotal.value, true)
                        .addField('獲得物品數目: ', playerStats.itemsLooted.value, true)
                        .addField('遊玩時數: ', playerStats.timePlayed.displayValue, true)
                        .addField('擊殺數(NPC): ', playerStats.killsNpc.value, true)
                        .addField('爆頭數: ', playerStats.headshots.value, true)
                    try {
                        await this.main.util.SDM(message.channel, playerInfo, message.author);
                    } catch (e) {}
                } 
                else {
                        let serverDown = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author}, 無法從伺服器取得資料!`, null, `#0099ff`);
                        try {
                            await this.main.util.SDM(message.channel, serverDown, message.author);
                        } catch (err) {}
                        return
                }
                })
        } else {
            let wronginfo = await this.main.util.createEmbed(message.author, 'ReiNa Bot Rework 錯誤', `請輸入正確資料`, null, 0xcc0000);
            wronginfo.addField('使用方法: ', this.main.config.prefix + "division [平台] [玩家UID]\n平台輸入 `uplay` `psn` `xbl` 分別為Uplay, PlayStationNetwork, Xbox");
            try {
                this.main.util.SDM(message.channel, wronginfo, message.author);
            } catch (e) {}
        }
    }
}