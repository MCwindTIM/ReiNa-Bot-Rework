const request = require('request');
const numchars = {'0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵'};

module.exports.UpdateTime = async (ReiNa) => {
    request.get(`http://worldtimeapi.org/api/timezone/Asia/Hong_Kong`, {},
    async (error, response, rawHK) => {
        if(error) return;
        if(!error && response.statusCode === 200){
            let timeHK = await JSON.parse(rawHK);
            var hkh = timeHK.slice(11,13).toString().replace(/[0123456789]/g, m=> numchars[m]);
            var hkm = timeHK.slice(14,16).toString().replace(/[0123456789]/g, m=> numchars[m]);
            try{
                await ReiNa.bot.channels.cache.get("655499386591248384").setName("﹥ 𝓗𝓚🕕: " + hkh + ":" + hkm);
                await ReiNa.bot.channels.cache.get("670914685352280064").setName("現時時間🕕: " + hkh + ":" + hkm);
                }catch(e){}
        }
    });

    request.get('http://worldtimeapi.org/api/timezone/Asia/Tokyo', {},
    async function(error, response, rawTK){
        if(error) return;
        if(!error && response.statusCode === 200){
            let timeTK = await JSON.parse(rawTK);
            var tkh = timeTK.slice(11,13).toString().replace(/[0123456789]/g, m=> numchars[m]);
            var tkm = timeTK.slice(14,16).toString().replace(/[0123456789]/g, m=> numchars[m]);
            try{
				await this.bot.channels.cache.get("660828847096201238").setName("﹥ 𝓙𝓟🕕: " + tkh + ":" + tkm + ":" + tks);
				}catch(e){}
        }
    });

}