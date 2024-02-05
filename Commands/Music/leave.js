const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('leave')
		.setDescription('離開語音頻道'),
	async run(ReiNa, interaction) {
        await interaction.deferReply({ ephemeral: true });
        if(ReiNa.bot.distube.voices.get(interaction.guild)){
            ReiNa.bot.distube.voices.leave(interaction.guild);
            return await interaction.editReply(`${interaction.member}, 成功中斷語音連接!`);
        }
        else{
            await interaction.editReply(`${interaction.member}, 我並不在此伺服器的語音頻道中!`);
        }
	},
};