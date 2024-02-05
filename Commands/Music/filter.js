const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('filter')
		.setDescription('開關音樂效果器')
        .addStringOption(filter =>
            filter.setName('效果器')
            .setDescription('選擇要開啓/關閉的效果器')
            .setRequired(true)
            .addChoices(
                {name: "3d", value: "3d"},
                {name: "bassboost", value: "bassboost"},
                {name: "echo", value: "echo"},
                {name: "karaoke", value: "karaoke"},
                {name: "nightcore", value: "nightcore"},
                {name: "vaporwave", value: "vaporwave"},
                {name: "flanger", value: "flanger"},
                {name: "gate", value: "gate"},
                {name: "haas", value: "haas"},
                {name: "reverse", value: "reverse"},
                {name: "surround", value: "surround"},
                {name: "mcompand", value: "mcompand"},
                {name: "phaser", value: "phaser"},
                {name: "tremolo", value: "tremolo"},
                {name: "earwax", value: "earwax"},
            )
        ),
	async run(ReiNa, interaction) {
        await interaction.deferReply({ ephemeral: true });

        const queue = ReiNa.bot.distube.getQueue(interaction);
        const filter = interaction.options.get("效果器");
        if (!queue) return await interaction.editReply(`${ReiNa.util.emoji.error} | 請先加入音樂再使用效果器!`);

        if (queue.filters.has(filter.value)) queue.filters.remove(filter.value)
        else queue.filters.add(filter.value)

        let filterMSG = ReiNa.util.createEmbed(interaction.user, `效果器`, `\`${queue.filters.names.join(', ') || 'Off'}\``, null, 0xAAFF00)
        
        return await interaction.editReply({ embeds: [filterMSG]});
	},
};