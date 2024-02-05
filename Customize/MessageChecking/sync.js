const syncCH = ['606000578144763914', '660789237137932299', '660444044345737216', '659756252469002280'];
const spyCH = ['407171840746848260'];
module.exports.run = async (ReiNa, message) =>{
if(syncCH.includes(message.channel.id)){
	if(message.attachments.size > 0){
		let i;
		for (i=0;i<message.attachments.size;i++){
			if(message.attachments.every(attachIsImage)){
				//get first object in message attachments collection
				ReiNa.bot.channels.cache.get("659756252469002280").send(`**${message.author.tag}**在 **${message.member.guild.name}** 的 **${message.channel.name}**:\n${message.attachments.array()[i].url}`);
			}
		}
	}
if(!message.content){}else{ReiNa.bot.channels.cache.get("659756252469002280").send(`**${message.author.tag}**在 **${message.member.guild.name}** 的 **${message.channel.name}**:\n${message.content}`);}

}
else{
	//spy
	if(spyCH.includes(message.channel.id)){
		if(message.attachments.size > 0){
			let i;
			for (i=0;i<message.attachments.size;i++){
				if(message.attachments.every(attachIsImage)){
					ReiNa.bot.channels.cache.get("659756252469002280").send(`**${message.author.tag}**在 **${message.member.guild.name}** 的 **${message.channel.name}**:\n${message.attachments.}`);
				}
			}
		}
		if(!message.content){}else{ReiNa.bot.channels.cache.get("659756252469002280").send(`**${message.author.tag}**在 **${message.member.guild.name}** 的 **${message.channel.name}**:\n${message.content}`);}
		
		}
    }
}


function attachIsImage(msgAttach){
	let url = msgAttach.url;
	if(url.indexOf("png", url.length - "png".length) !== -1){return true}
	if(url.indexOf("jpg", url.length - "jpg".length) !== -1){return true}
	if(url.indexOf("gif", url.length - "gif".length) !== -1){return true}
	if(url.indexOf("jpeg", url.length - "jpeg".length) !== -1){return true}
	return false
}
