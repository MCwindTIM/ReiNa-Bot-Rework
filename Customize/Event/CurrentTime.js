const request = require('request');

module.exports.UpdateTime = async function(){
    try{
        let numchars = {'0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵'};
        request.get('http://worldtimeapi.org/api/timezone/Asia/Hong_Kong', {},
        async function(error, response, rawHK){
            if(error){}
            if(!error && response.statusCode == 200){
                var objHK = JSON.parse(rawHK);
                var timeHK = objHK.datetime;
                var hkh = timeHK.slice(11,13).toString().replace(/[0123456789]/g, m=> numchars[m]);
                var hkm = timeHK.slice(14,16).toString().replace(/[0123456789]/g, m=> numchars[m]);
                var hks = timeHK.slice(17,19).toString().replace(/[0123456789]/g, m=> numchars[m]);
                try{
                await this.bot.channels.cache.get("655499386591248384").setName("﹥ 𝓗𝓚🕕: " + hkh + ":" + hkm + ":" + hks);
                await this.bot.channels.cache.get("670914685352280064").setName("現時時間🕕: " + hkh + ":" + hkm + ":" + hks);
                }catch(e){}
            }
            if(response === undefined || response.statusCode != 200){}
        });

        request.get('http://worldtimeapi.org/api/timezone/Asia/Tokyo', {},
		async function(error, response, rawTK){
			if(error){}
			if(!error && response.statusCode == 200){
				var objTK = JSON.parse(rawTK);
				var timeTK = objTK.datetime;
				var tkh = timeTK.slice(11,13).toString().replace(/[0123456789]/g, m=> numchars[m]);
				var tkm = timeTK.slice(14,16).toString().replace(/[0123456789]/g, m=> numchars[m]);
				var tks = timeTK.slice(17,19).toString().replace(/[0123456789]/g, m=> numchars[m]);
				try{
				await this.bot.channels.cache.get("660828847096201238").setName("﹥ 𝓙𝓟🕕: " + tkh + ":" + tkm + ":" + tks);
				}catch(e){}
			}
			if(response === undefined || response.statusCode != 200){}
		});
    }catch(e){console.log(e)}
}