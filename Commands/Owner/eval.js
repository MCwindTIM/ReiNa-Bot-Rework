const Discord = require('discord.js');
const os = require('os');
const { inspect } = require('util');
const request = require('request');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('eval')
		.setDescription('將字符串作爲脚本執行')
        .addStringOption(input =>
            input.setName('字符串')
                .setDescription('需要運算的字符串')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('隱藏')
                .setDescription('只有你能閲讀運算結果 (默認為不隱藏)')),
	async run(ReiNa, interaction) {
        await interaction.deferReply({ ephemeral: (interaction.options.get('隱藏')?.value) });
        let hrStart = process.hrtime();
        if(!ReiNa.util.checkUserPerm(interaction.user.id)) return await interaction.editReply(`${ReiNa.util.emoji.error} | 你沒有權限使用此指令!`);
        
        let toEval = interaction.options.get("字符串").value;
         // let file = message.attachments.get(message.attachments.keys().next().value) ? true : false;
        try{
            let evaluated = inspect(eval(toEval, { depth: 0} ))
            let hrDiff;
            hrDiff = process.hrtime(hrStart);
            let Evaled = ReiNa.util.createEmbed(interaction.user, `ReiNa Bot Rework Eval`, `*處理時間: ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms. 如果輸入/輸出字串長度大於1024, 只會顯示1024個字元*`);
            Evaled.addFields(
                {name: '輸入', value: `\`\`\`js\n${toEval.substr(0, (1024 - 10))}\`\`\``},
                {name: '輸出', value: `\`\`\`js\n${evaluated.substr(0, (1024 - 10))}\`\`\``}
            );
            return await interaction.editReply({ embeds: [Evaled]});
        }
        catch(e){
            let errMSG = ReiNa.util.createEmbed(interaction.user, `ReiNa Bot Rework 錯誤`, `${interaction.user} 哎呀, 出錯啦! *如果輸入/輸出字串長度大於1024, 只會顯示1024個字元*`);
            errMSG.addFields(
            {name: '輸入', value: `\`\`\`js\n${toEval.substr(0, (1024 - 10))}\n\`\`\``},
            {name: "eval 錯誤", value: `${e.message.substr(0, (1024 - 10))}`});
            return await interaction.editReply({ embeds: [errMSG]});
        }
	},
};