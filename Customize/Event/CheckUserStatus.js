module.exports.CheckUserStatus = async (ReiNa) => {
    let offlineMembers = await ReiNa.bot.guilds.cache.get("398062441516236800").members.cache.filter(member => member.presence.status === "offline" && member.user.bot === false);
    await offlineMembers.forEach((member) => offlineuserrole(ReiNa, member));
}

function offlineuserrole(ReiNa, user){
if(!user.roles.cache.has('430389070246576128' && !user.roles.cache.has('469539612059107329'))){
    moveVC(ReiNa, user);
}
}

function moveVC(ReiNa, user){
const userVC = user.voice.channel;
const offlineVC = ReiNa.bot.channels.cache.find(x => x.name === "💤隱身/離線/驗證失敗");
if(userVC){
    user.voice.setChannel(offlineVC);
}
}