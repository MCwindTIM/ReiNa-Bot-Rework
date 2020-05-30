let botuser = 0; 
let memberuser = 0;
let alluser = 0;
let numchars = {'0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵'};

module.exports.UpdateUser = async function (ReiNa) {

    botuser = 0;memberuser = 0;alluser = 0;
    try{
    await ReiNa.bot.guilds.cache.get("398062441516236800").members.fetch().then(r => {
        r.forEach((member, key) => checkuserbot(member))
        });
    botuser = botuser.toString().replace(/[0123456789]/g, m => numchars[m]);
    alluser = alluser.toString().replace(/[0123456789]/g, m => numchars[m]);
    memberuser = memberuser.toString().replace(/[0123456789]/g, m => numchars[m]);
    await ReiNa.bot.channels.cache.get("655499341590560779").setName("﹥ 𝓣𝓸𝓽𝓪𝓵 𝓾𝓼𝓮𝓻𝓼: " + `${alluser}`);
    await ReiNa.bot.channels.cache.get("655499368136179712").setName(`﹥ 𝓑𝓸𝓽: ${botuser}`);
    await ReiNa.bot.channels.cache.get("655499422465261569").setName(`﹥ 𝓤𝓼𝓮𝓻: ${memberuser}`);
    }catch(e){}
}

function checkuserbot(member){
    if(member.user.bot === true){botuser = botuser + 1;alluser = alluser + 1;} if(member.user.bot === false){memberuser = memberuser + 1;alluser = alluser + 1;}

}