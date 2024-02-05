const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('queue')
		.setDescription('顯示播放列表'),
	async run(ReiNa, interaction) {
        if (!(ReiNa.bot.distube.queues.get(interaction.guildId))) return interaction.reply(`現在沒有播放任何音樂.`);
        console.log(ReiNa.bot.distube.queues.get(interaction.guildId))
	},
};