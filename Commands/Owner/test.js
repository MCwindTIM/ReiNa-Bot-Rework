const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('test')
		.setDescription('開發人員測試指令'),
	async run(ReiNa, interaction) {
        return
	},
};
