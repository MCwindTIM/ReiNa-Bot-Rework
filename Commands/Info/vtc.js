const Command = require('../../Core/command');
const superagent = require('superagent');
const cheerio = require('cheerio');

module.exports = class vtcCommand extends Command {
    constructor(main){
        super(main, {
            name: "vtc",
            category: "信息",
            help: "截取vtc最新信息",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let dataArray = [];
        dataArray = getData("https://myportal.vtc.edu.hk/wps/portal/", dataArray, message, this);
    }

    
}

function getData(url, dataArray, message, ReiNa){
    superagent.get(url).set('Accept-Language', 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6,zh-CN;q=0.5,und;q=0.4').end((err, res) => {
        if(err){
            console.log(`Error: ${err}`);
            let ErrMSG = ReiNa.main.util.createEmbed(message.author, null, `${message.author}, Senpai~ 發生錯誤 請稍後再試!`);
            try{
                ReiNa.main.util.SDM(message.channel, ErrMSG, message.author);
            }catch(e){}
        } else {
            let $ = cheerio.load(res.text);
			let i;
			$('p').attr('dir', 'ltr').each((idx, ele) =>{
				if($(ele).text().match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/)){
				dataArray.push($(ele).text());
				}
            })
            let fetchMSG = ReiNa.main.util.createEmbed(message.author, null, `${message.author}, Senpai~ 已經獲取到VTC最新的消息了!`);
			for(let i = 0; i < dataArray.length; i++){
				fetchMSG.addField(`消息 ${i + 1}`, `${dataArray[i]}`);
            }
			try {
				ReiNa.main.util.SDM(message.channel, fetchMSG, message.author);
			}catch(e){}
        }
	});

}