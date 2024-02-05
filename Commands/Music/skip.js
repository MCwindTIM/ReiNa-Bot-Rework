const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('skip')
		.setDescription('跳過現正播放的音樂'),
	async run(ReiNa, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const queue = ReiNa.bot.distube.getQueue(interaction);
        if (!queue) return await interaction.editReply(`${ReiNa.util.emoji.error} | 沒有音樂可以跳過!`);
        try {
            const lastSong = queue.songs[0].name;
            const song = await queue.skip();
            const successMSG = ReiNa.util.createEmbed(interaction.user, `跳過音樂`, `${ReiNa.util.emoji.success} | 已跳過音樂\`${lastSong}\` \n\n接著播放: \`${song.name}\``, null, 0xAAFF00)
            return await interaction.editReply({ embeds: [successMSG]});
        } catch (e) {
            const errorMSG = ReiNa.util.createEmbed(interaction.user, `跳過音樂`, `${ReiNa.util.emoji.error} | ${e}`, null, 0xAAFF00)
            return await interaction.editReply({ embeds: [errorMSG]});
        }
	},
};