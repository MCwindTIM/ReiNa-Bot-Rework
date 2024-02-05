const superagent = require('superagent');
const cheerio = require('cheerio');

module.exports.run = async (ReiNa, message) =>{
        if(message.content.startsWith("[w") && message.content.endsWith("]")){
        message.delete().catch();
        let doujinid = message.content.toString().replace("[w", "").replace("]", "");
        let url = `https://www.wnacg.com/photos-index-aid-${doujinid}.html`
        getData(url, message, doujinid, ReiNa);
    }
}

module.exports.name = "wnacg車牌號";

function getData(url, message, doujinid, ReiNa){
    superagent.get(url).set('Accept-Language', 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6,zh-CN;q=0.5,und;q=0.4').end((err, res) => {
        let dataArray = [];
        let TagString = "| ";
        if(err){
            console.log(`Error: ${err}`)
        } else {
            let $ = cheerio.load(res.text);
			let i;
			let o = 0;
			$('.addtags a').attr('class', 'tagshow').each((idx, ele) =>{
				if($(ele).text().includes("+TAG")){ }else{
				dataArray.push($(ele).text());
				o += 1;
				}
			})
				dataArray.push($('h2').first().text());
				dataArray.push($(`#bodywrap .asTB div`).attr('class', 'asTBcell uwthumb').find(`img`).attr('src'));
			$('label').each((idx, ele) =>{
			dataArray.push($(ele).text().replace("分類：", "").replace("頁數：", ""));
			})
            if(dataArray.length < 4){
                let notFound = ReiNa.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author}, 😭這塊車牌我找不到資料\n\n車牌號碼: **w${doujinid}**`, `http://www.wnacg.com/`, 0xcc0000);
                try{
                    ReiNa.util.SDM(message.channel, notFound, message.author);
                }catch(e){}
            }else{
                console.log(dataArray[o])
                dataArray[o+1] = dataArray[o+1].replace("////", "https://");
                if(dataArray[o+1].startsWith("/")){
                    dataArray[o+1] = dataArray[o+1].replace("//", "https://");
                }
                let doujinMSG = ReiNa.util.createEmbed(message.author, `點我進入新世界!!!`, `${message.author}, 你要求查詢的資料找到了!`, `${url}`, 0xcc0000);
                doujinMSG
                .setThumbnail(`${dataArray[o+1]}`)
                .addField(`${dataArray[o]}`, "(･ω<)☆")
                .addField(`分類:`, `${dataArray[o+2]}`)
                .addField(`頁數:`, `${dataArray[o+3]}`)
                for(i = 0; i < o; i++){
                    TagString += `| ${dataArray[i]} `;
                }
                doujinMSG.addField("標籤", `${TagString}`);
                try {
                    ReiNa.util.SDM(message.channel, doujinMSG, message.author);
                }   catch (e) {}
            }
        }
	});

}