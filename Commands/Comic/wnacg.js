const Discord = require('discord.js');
const superagent = require('superagent');
const cheerio = require('cheerio');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('紳士漫畫')
		.setDescription('查詢紳士漫畫本本')
        .addStringOption(id => 
            id.setName(`id`)
                .setDescription('wnacg(紳士漫畫)車牌號')
                .setRequired(true)),
	async run(ReiNa, interaction) {
        await interaction.deferReply();
        let msg = await getData(interaction, ReiNa)
        return await interaction.editReply({ embeds: [msg]});
	},
};  
async function getData(interaction, ReiNa){
    return new Promise((resolve, reject) => {
        var url = `https://www.wnacg.com/photos-index-aid-${interaction.options.getString("id")}.html`;
        superagent.get(url).set('Accept-Language', 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6,zh-CN;q=0.5,und;q=0.4').end((err, res) => {
            let TagString = "| ";
            if(!err){
                let $ = cheerio.load(res.text);
                let obj = {};
                obj.title = $('h2').first().text();
                obj.classify = $('.uwconn label').html().replace(/分類：/g,"");
                obj.pages = $('.uwconn label').eq(1).html().replace(/頁數：/g,"");
                obj.tags = new Array
                $('.uwconn .addtags .tagshow').each(function(index,item){
                  obj.tags.push($(item).html())                                //漫画标签
                })
                obj.summary = $('.uwconn p').html().replace(/簡介：/g,"");
                obj.summary = obj.summary.replace(/<br>/g,"");
                obj.uploader = $('.uwuinfo img').next('p').html();
                obj.thumbnail = $(`.uwthumb img`).eq(0).attr('src').replace("////", "https://");
                for(let i = 0; i < obj.tags.length; i++){
                    TagString += `| ${obj.tags[i]} `;
                }
                console.table(obj)
                if(Object.keys(obj).length === 0 && obj.constructor === Object){
                    let notFound = ReiNa.util.createEmbed(interaction.user, `ReiNa Bot Rework 錯誤`, `${interaction.user}, 😭這塊車牌我找不到資料\n\n車牌號碼: ${doujinid}**`, `http://www.wnacg.com/`, 0xcc0000);
                    resolve(notFound);
                }else{
                    let doujinMSG = ReiNa.util.createEmbed(interaction.user, `點我進入新世界!!!`, `${interaction.user}, 你要求查詢的資料找到了!`, url, ReiNa.util.color.yellow);
                    doujinMSG
                    .setThumbnail(`${obj.thumbnail}`)
                    // .addField(`${dataArray[o]}`, "(･ω<)☆")
                    .addFields(
                        {name: obj.title, value: '(･ω<)☆'},
                        {name: `分類:`, value: `${obj.classify}`},
                        {name: `頁數:`, value: `${obj.pages}`},
                        {name: `簡介:`, value: `${obj.summary === '' ? '無' : obj.summary}`},
                        {name: "標籤",  value: `${TagString}`})
                    resolve(doujinMSG);
                }
            }
        });
    })
}