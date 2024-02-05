const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('驗證')
		.setDescription('全自動區分電腦和人類的圖靈測試'),
	async run(ReiNa, interaction) {
        await interaction.deferReply({ ephemeral: true });
        if(interaction.channelId != "702962295998906398"){
            return await interaction.editReply(`此功能僅在特定頻道生效`);
        }
        return await interaction.editReply(`此功能未更新`);
    },
};