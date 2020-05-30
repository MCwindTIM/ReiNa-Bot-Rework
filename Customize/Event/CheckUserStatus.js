module.exports.CheckUserStatus = async (ReiNa) => {
    let offlineMembers;
    //let onlineMembers;
        offlineMembers = await ReiNa.bot.guilds.cache.get("398062441516236800").members.cache.filter(member => member.presence.status === "offline" && member.user.bot === false);
        //onlineMembers = await ReiNa.bot.guilds.cache.get("398062441516236800").members.cache.filter(member => member.presence.status !== "offline" && member.user.bot === false);
        //await onlineMembers.forEach((member) => onlineuserrole(member));
        await offlineMembers.forEach((member) => offlineuserrole(ReiNa, member));
}

function offlineuserrole(ReiNa, user){
    if(!user.roles.cache.has('430389070246576128')){
        // user.roles.remove('417634328332337153');
        // user.roles.add('647004218812661761');
        moveVC(ReiNa, user);
    }
}

// function onlineuserrole(user){
//     if(!user.roles.cache.has('430389070246576128')){
//         user.roles.remove('647004218812661761');
//         user.roles.add('417634328332337153');
//     }
// }


function moveVC(ReiNa, user){
    const userVC = user.voice.channel;
    const offlineVC = ReiNa.bot.channels.cache.find(x => x.name === "????/??/????");
    if(userVC){
        user.voice.setChannel(offlineVC);
    }
}