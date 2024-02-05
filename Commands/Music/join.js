const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('join')
		.setDescription('加入語音頻道')
        .addChannelOption(option =>
            option.setName('語音頻道')
                .setDescription('指定加入特定語音頻道.')
                .addChannelTypes(Discord.ChannelType.GuildVoice)),
	async run(ReiNa, interaction) {
        await interaction.deferReply({ ephemeral: true });
        if(!interaction.member.voice?.channel && !interaction.options.get('語音頻道')) return await interaction.editReply(`${interaction.member}, 你未加入或指定任何屬於此伺服器的語音頻道.`)

        const vc = interaction.options.get('語音頻道')?.channel ?? interaction.member.voice?.channel

        await ReiNa.bot.distube.voices.join(vc);
        return await interaction.editReply(`已加入📢${vc}`)

	},
};