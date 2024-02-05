const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('stop')
		.setDescription('停止播放音樂'),
	async run(ReiNa, interaction) {
        await interaction.deferReply();
		
        const queue = ReiNa.bot.distube.getQueue(interaction);
		if(!queue || queue.songs.length === 0){
			const nullMSG = ReiNa.util.createEmbed(interaction.user, `${ReiNa.util.emoji.error}錯誤`, `${interaction.member}, 播放列表是空的`, null, ReiNa.util.color.red);   
			return await interaction.editReply({ embeds: [nullMSG]});
		}
		
        ReiNa.bot.distube.stop(interaction.guild);
        
		const stopMSG = ReiNa.util.createEmbed(interaction.user, `${ReiNa.util.emoji.music} 播放器控制菜單`, `${ReiNa.util.emoji.stop} **停止播放**`, null, ReiNa.util.color.orange);
		return await interaction.editReply({embeds: [stopMSG]});

	},
};