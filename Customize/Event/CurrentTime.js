module.exports.UpdateTime = async (ReiNa) => {
    let time = new Date();
    let hkh = time.getHours().toString();
    let hkm = time.getMinutes().toString();
    let tkh = (time.getHours() + 1).toString();
    is0(hkh) ? add0(hkh).then(h => hkh = replace(h)) : hkh = replace(hkh);
    is0(hkm) ? add0(hkm).then(m => hkm = replace(m)) : hkm = replace(hkm);
    is0(tkh) ? add0(tkh).then(th => tkh = replace(th)) : tkh = replace(tkh);

    await ReiNa.bot.channels.cache.get("655499386591248384").setName("﹥ 𝓗𝓚🕕: " + hkh + ":" + hkm);
    await ReiNa.bot.channels.cache.get("670914685352280064").setName("現時時間🕕: " + hkh + ":" + hkm);
    await ReiNa.bot.channels.cache.get("660828847096201238").setName("﹥ 𝓙𝓟🕕: " + tkh + ":" + hkm);
}

function is0(tString){
    if(tString == 0){
        return true;
    }
    return false;
}

function add0(tString){
    return `${tString}0`
}

function replace(tString){
    const numchars = {'0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵'};
    return tString.replace(/[0123456789]/g, m=> numchars[m]);
}