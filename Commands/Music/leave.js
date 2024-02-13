const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('leave')
		.setDescription('離開語音頻道'),
	async run(ReiNa, interaction) {
        await interaction.deferReply({ ephemeral: true });
        if(ReiNa.bot.distube.voices.get(interaction.guild)){
            ReiNa.bot.distube.voices.leave(interaction.guild);
            let leaveMSG = ReiNa.util.createEmbed(interaction.user, "離開語音頻道", "成功中斷語音連接!", null, ReiNa.util.color.orange);
            return await interaction.editReply({embeds: [leaveMSG]});
        }
        else{
            let errorMSG = ReiNa.util.createEmbed(interaction.user, `${this.main.util.emoji.error} 哎呀! 出錯啦!`, "我並不在此伺服器的語音頻道中!", null, ReiNa.util.color.red);
            await interaction.editReply({embeds: [errorMSG]});
        }
	},
};