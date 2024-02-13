const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('queue')
		.setDescription('顯示播放列表'),
	async run(ReiNa, interaction) {
		await interaction.deferReply({ephemeral: true})
        if (!(ReiNa.bot.distube.queues.get(interaction.guildId))){
			let errorMSG = ReiNa.util.createEmbed(interaction.user, `${ReiNa.util.emoji.error} 哎呀! 出錯啦!`, "現在沒有播放任何音樂.", null, ReiNa.util.color.red);
			return await interaction.editReply({embeds: [errorMSG]});
		}
		const queueEmbed = await ReiNa.util.getQueueEmbed(interaction);
		return await interaction.editReply({embeds: [queueEmbed]});
	}
}