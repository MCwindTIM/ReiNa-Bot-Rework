const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('invite')
		.setDescription('取得ReiNa的邀請連結'),
	async run(ReiNa, interaction) {
        await interaction.deferReply({ ephemeral: true });
        let inviteMSG = ReiNa.util.createEmbed(interaction.user, null, `${interaction.user}, 我的邀請連結是 https://discord.com/api/oauth2/authorize?client_id=${ReiNa.config.clientId}&permissions=8&scope=bot`);
        return await interaction.editReply({ embeds: [inviteMSG]});
	},
};