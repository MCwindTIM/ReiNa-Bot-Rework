const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('help')
		.setDescription('列出所有指令'),
	async run(ReiNa, interaction) {
        await interaction.deferReply({ ephemeral: true });
        let helpMSG = ReiNa.util.createEmbed(interaction.user, `所有可用指令`, ReiNa.commands.map(cmd => `\`${cmd.data.name}\``).join(', '), null, 0xAAFF00)
        return await interaction.editReply({ embeds: [helpMSG]});
	},
};