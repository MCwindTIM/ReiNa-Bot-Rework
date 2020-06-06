const Command = require('../../Core/command');
const request = require('request');

module.exports = class osuCommand extends Command {
    constructor(main){
        super(main, {
            name: "osu",
            category: "信息",
            help: "查詢osu 玩家信息!",
            args: [
            {
                name: "玩家名稱",
                desc: "玩家名稱字串"
            }],
            caseSensitive: true
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let playerID;
        if(args[0]) playerID = await args.join(" ");
        request.get(`https://osu.ppy.sh/api/get_user?u=${playerID}&k=${this.main.config.osuAPI}`, {}, async (error, request, body) => {
            if(request.statusCode != 200){
                let error = this.main.util.createEmbed(message.author, `OSU 玩家查詢`, `osu api 伺服器沒有回應... 請稍後再試!`);
                await this.main.util.SDM(message.channel, error, message.author);
                return;
            }
            if(JSON.parse(body) === null){
                let notFound = this.main.util.createEmbed(message.author, `OSU 玩家查詢`, `沒有查詢到該玩家!`);
                await this.main.util.SDM(message.channel, error, message.author);
                return;
            }
            let data = await JSON.parse(body);
            let playerInfo = await this.main.util.createEmbed(message.author, `OSU 玩家查詢 (詳細資料請點我 (=ﾟωﾟ)ﾉ)`, `${message.author} Senpai, 你請求的OSU 玩家資料找到了~`, `https://osu.ppy.sh/users/${data[0].user_id}`, `'#0099ff'`);
            playerInfo
                .setThumbnail(`https://www.countryflags.io/${data[0].country}/shiny/64.png`)
                .addField('玩家ID: ', data[0].user_id, true)
                .addField('玩家UID: ', data[0].username, true)
                .addField('玩家國際排名', data[0].pp_rank, true)
                .addField('玩家國家排名', data[0].pp_country_rank, true)
                .addField('玩家國籍', data[0].country, true)
                .addField('玩家等級: ', data[0].level, true)
                .addField('現時積分[PP]: ', data[0].pp_raw, true)
                .addField('玩家平均準確度: ', `${parseFloat(data[0].accuracy).toFixed(2)}%`, true)
                .addField('玩家有效遊玩次數', data[0].playcount, true)
                .addField('玩家總分數', data[0].total_score, true)
                .addField('玩家排名總分數', data[0].ranked_score, true)
                .addField('SS評級數目', data[0].count_rank_ss, true)
                .addField('SSH評級數目', data[0].count_rank_ssh, true)
                .addField('S評級數目', data[0].count_rank_s, true)
                .addField('SH評級數目', data[0].count_rank_sh, true)
                .addField('A評級數目', data[0].count_rank_a, true)
                .addField('300分次數', data[0].count300, true)
                .addField('100分次數', data[0].count100, true)
                .addField('50分次數', data[0].count50, true)
                .addField('玩家註冊日期', data[0].join_date, true)
                .addField('玩家遊玩時數', `${Math.round((data[0].total_seconds_played / 60 / 60))}小時`, true)
                .setImage(`https://a.ppy.sh/${data[0].user_id}`)
                try {
                    await this.main.util.SDM(message.channel, playerInfo, message.author);
                }   catch (err) {
                    console.error(err);
                }
        })
    }
}