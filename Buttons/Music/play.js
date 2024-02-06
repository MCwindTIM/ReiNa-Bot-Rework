const Discord = require("discord.js")

module.exports = {
    btn: new Discord.ButtonBuilder()
        .setCustomId('musicPlay')
        .setLabel(`▶️`)
        .setStyle(Discord.ButtonStyle.Secondary),
    async run(ReiNa, interaction){
        interaction.edit({content: `clicked!`})
    }
}