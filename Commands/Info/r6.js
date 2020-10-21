const Command = require('../../Core/command');
const request = require('request');

module.exports = class R6Command extends Command {
    constructor(main){
        super(main, {
            name: "r6",
            category: "信息",
            help: "查詢R6 玩家信息!",
            args: [{
                name: "平台",
                desc: "xbox / psn / uplay"
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
        let api = `?cid=${this.main.config.R6API}`;
        if(args.length === 2){
            request.get.call(this, `https://r6.apitab.com/search/${args[0]}/${args[1]}${api}`, {},
            (error, response, body) => {
            if(response.statusCode == 200){
                var obj = JSON.parse(body);
                if(obj.players == ""){
                    let playerNotFound = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} Senpai, 沒有找到該位玩家欸!`, null, `#0099ff`);
                        try {
                            this.main.util.SDM(message.channel, playerNotFound, message.author);
                        }   catch (err) {
                            console.error(err);
                        }
                    return;
                }
                let player = Object.keys(obj.players)[0];
                    request.get.call(this, `https://r6.apitab.com/update/${player}${api}`, {},
                    async (error, response, rawdata) => {
                        var obj = JSON.parse(rawdata);
                        var rank = "";
                        let UTime = new Date(obj.refresh.utime * 1000);
                        let commonUTime = UTime.toLocaleString();
    
                        var rankpic = "";
                        if(obj.ranked.rankname === "Unranked"){
                            rank = "未排名";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/0.png";
                        }
                        if(obj.ranked.rankname === "Copper 5"){
                            rank = "Copper V 紫銅V";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/1.png";
                        }
                        if(obj.ranked.rankname === "Copper 4"){
                            rank = "Copper IV 紫銅IV";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/2.png";
                            
                        }
                        if(obj.ranked.rankname === "Copper 3"){
                            rank = "Copper III 紫銅III";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/3.png";
                        }
                        if(obj.ranked.rankname === "Copper 2"){
                            rank = "Copper II 紫銅II";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/4.png";
                        }
                        if(obj.ranked.rankname === "Copper 1"){
                            rank = "Copper I 紫銅I";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/5.png";
                        }
                        if(obj.ranked.rankname === "Bronze 5"){
                            rank = "Bronze V 黃銅V";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/6.png";
                        }
                        if(obj.ranked.rankname === "Bronze 4"){
                            rank = "Bronze IV 黃銅IV";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/7.png";
                        }
                        if(obj.ranked.rankname === "Bronze 3"){
                            rank = "Bronze III 黃銅III";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/8.png";
                        }
                        if(obj.ranked.rankname === "Bronze 2"){
                            rank = "Bronze II 黃銅II";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/9.png";
                        }
                        if(obj.ranked.rankname === "Bronze 1"){
                            rank = "Bronze I 黃銅I";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/10.png";
                        }
                        if(obj.ranked.rankname === "Silver 5"){
                            rank = "Silver V 白銀V";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/11.png";
                        }
                        if(obj.ranked.rankname === "Silver 4"){
                            rank = "Silver IV 白銀IV";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/12.png";
                        }
                        if(obj.ranked.rankname === "Silver 3"){
                            rank = "Silver III 白銀III";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/13.png";
                        }
                        if(obj.ranked.rankname === "Silver 2"){
                            rank = "Silver II 白銀II";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/14.png";
                        }
                        if(obj.ranked.rankname === "Silver 1"){
                            rank = "Silver I 白銀I";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/15.png";
                        }
                        if(obj.ranked.rankname === "Gold 3"){
                            rank = "Gold III 黃金III";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/16.png";
                        }
                        if(obj.ranked.rankname === "Gold 2"){
                            rank = "Gold II 黃金II";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/17.png";
                        }
                        if(obj.ranked.rankname === "Gold 1"){
                            rank = "Gold I 黃金I";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/18.png";
                        }
                        if(obj.ranked.rankname === "Platinum 3"){
                            rank = "Platinum III 白金III";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/19.png";
                        }
                        if(obj.ranked.rankname === "Platinum 2"){
                            rank = "Platinum II 白金II";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/20.png";
                        }
                        if(obj.ranked.rankname === "Platinum 1"){
                            rank = "Platinum I 白金I";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/21.png";
                        }
                        if(obj.ranked.rankname === "Diamond"){
                            rank = "Diamond!!! 鑽石階級"
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/22.png";
                        }
                        if(obj.ranked.rankname === "Champion"){
                            rank = "Champion!!! 冠軍階級";
                            rankpic = "https://duckduckdoc.tk/wp-content/uploads/drive/r6rankpic/23.png";
                        }
                        let playerInfo = await this.main.util.createEmbed(message.author, `R6 玩家查詢 (詳細資料請點我 (=ﾟωﾟ)ﾉ)`, `${message.author} Senpai, 你請求的R6 Siege 玩家資料找到了~`, `https://r6tab.com/player/${obj.player.p_id}`, `'#0099ff'`);
                        playerInfo
                            .setThumbnail(rankpic)
                            .addField('玩家UID: ', obj.player.p_name, true)
                            .addField('玩家等級: ', obj.stats.level, true)
                            .addField('平台: ', obj.player.p_platform, true)
                            .addField(`現時積分[${obj.ranked.topregion}]: `, obj.ranked.actualmmr, true)
                            .addField('玩家排位: ', rank, true)
                            .addField('玩家排位KD: ', obj.ranked.kd, true)
                            .addField('爆頭率(總計): ', obj.stats.generalpvp_hsrate, true)
                            .addField('排位勝場: ', obj.ranked.allwins, true)
                            .addField('排位敗場: ', obj.ranked.alllosses, true)
                            .addField('排位賽殺人數: ', obj.ranked.allkills, true)
                            .addField('排位賽死亡數: ', obj.ranked.alldeaths, true)
                            .addField('排位賽勝負比: ', obj.ranked.allwl, true)
                            .addField('助攻數(總計): ', obj.stats.generalpvp_killassists, true)
                            .addField('爆頭數(總計): ', obj.stats.generalpvp_headshot, true)
                            .addField('最常用幹員(攻擊方): ', obj.op_main.overall.attacker, true)
                            .addField('最常用幹員(防守方) ', obj.op_main.overall.defender, true)
                            .addField('PVP時數(小時): ', obj.stats.generalpvp_hoursplayed, true)
                            .addField('數據更新於: ', `${commonUTime} GMT +8 香港標準時間`, true)
                            .setImage(`https://ubisoft-avatars.akamaized.net/${obj.player.p_id}/default_146_146.png`)
                            try {
                                await this.main.util.SDM(message.channel, playerInfo, message.author);
                            }   catch (e) {}
                    });
            }
            })
        }
        else{
            let wronginfo = await this.main.util.createEmbed(message.author, 'ReiNa Bot Rework 錯誤', `請輸入正確資料`, null, 0xcc0000);
            wronginfo.addField('使用方法: ', "rn!r6 [平台] [玩家UID]\n平台輸入 `uplay` `psn` `xbl` 分別為Uplay, PlayStationNetwork, Xbox");
            try {
                this.main.util.SDM(message.channel, wronginfo, message.author);
            }   catch (e) {}
        }
    }
}