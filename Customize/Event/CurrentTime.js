module.exports.UpdateTime = async (ReiNa) => {
    let time = new Date();
    let numchars = {'0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵'};
    let hkh = time.getHours().toString().replace(/[0123456789]/g, m=> numchars[m]);
    let hkm = time.getMinutes().toString().replace(/[0123456789]/g, m=> numchars[m]);
    let tkh = (time.getHours() + 1).toString().replace(/[0123456789]/g, m=> numchars[m]);
    await ReiNa.bot.channels.cache.get("655499386591248384").setName("﹥ 𝓗𝓚🕕: " + hkh + ":" + hkm);
    await ReiNa.bot.channels.cache.get("670914685352280064").setName("現時時間🕕: " + hkh + ":" + hkm);
    await ReiNa.bot.channels.cache.get("660828847096201238").setName("﹥ 𝓙𝓟🕕: " + tkh + ":" + hkm);
}