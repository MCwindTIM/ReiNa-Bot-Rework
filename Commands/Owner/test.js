const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('test')
		.setDescription('開發人員測試指令'),
	async run(ReiNa, interaction) {
        await interaction.deferReply({ ephemeral: true });
        if(!ReiNa.util.checkUserPerm(interaction.user.id)) return await interaction.editReply(`${ReiNa.util.emoji.error} | 你沒有權限使用此指令!`);

        let testMSG = ReiNa.util.createEmbed(interaction.user, `測試`, `測試內容`, null, 0xAAFF00)
        const response = await interaction.editReply({
            embeds: [testMSG],
            components: [ ReiNa.buttons.testRow ],
        });

        //Components collector
        const filter = i => i.user.id === interaction.user.id;
        try {
            while(1){
                const confirmation = await response.awaitMessageComponent({ filter: filter, time: 10000 });
                if (confirmation.customId === 'musicPlay') {
                    const playMSG = ReiNa.util.createEmbed(interaction.user, `測試followUp`, `play`, null, 0xAAFF00);
                    await interaction.followUp({embeds: [playMSG], ephemeral: true});
                    await confirmation.update({components: [ ReiNa.buttons.testRow ]});
                } else if (confirmation.customId === 'musicPause') {
                    const pauseMSG = ReiNa.util.createEmbed(interaction.user, `測試followUp`, `pause`, null, 0xAAFF00);
                    await interaction.followUp({embeds: [pauseMSG], ephemeral: true});
                    await confirmation.update({components: [ ReiNa.buttons.testRow ]});
                }
            }
        } catch (e) {
            if(!e.message.includes(`time`)) return console.log(e);
            const testMSG = ReiNa.util.createEmbed(interaction.user, `測試followUp`, `超時`, null, 0xAAFF00);
            return await interaction.editReply({ embeds: [testMSG.setDescription(`超時`)], components: [] });
        }
	},
};