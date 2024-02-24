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
        let member = interaction.member;
        let array = [ interaction.user.id];
        const canvas = Canvas.createCanvas(100, 30);
        const ctx = canvas.getContext('2d');
        const blankbg = await Canvas.loadImage('./Src/blankbg.jpg');
        ctx.drawImage(blankbg, 0, 0, canvas.width, canvas.height);
        ctx.font = '24px "Microsoft YaHei"';

        let drawText = (text, x) => {
            ctx.save();
            const angle = Math.random() / 10;
            const y = 22;
            ctx.rotate(angle);
            ctx.fillText(text, x, y);
            ctx.restore();
        }

        let drawLine = () => {
            const num = Math.floor(Math.random() * 2 + 3);
            for (let i = 0; i < num; i++) {
                const color = '#' + (Math.random() * 0xffffff << 0).toString(16);
                const y1 = Math.random() * canvas.height;
                const y2 = Math.random() * canvas.height;
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.lineTo(0, y1);
                ctx.lineTo(canvas.width, y2);
                ctx.stroke();
            }
        }
        const numArr = [
            '〇一二三四五六七八九',
            '0123456789',
            '零壹貳叁肆伍陸柒捌玖'
        ];
        
        const fir = Math.floor(Math.random() * 10);
        const sec = Math.floor(Math.random() * 10);
        const operArr = ['加', '減', '乘'];
        const oper = Math.floor(Math.random() * operArr.length);
        
        drawLine();
        drawText(numArr[Math.floor(Math.random() * numArr.length)][fir], 10);
        drawText(operArr[oper], 40);
        drawText(numArr[Math.floor(Math.random() * numArr.length)][sec], 70);
        drawText('=', 100);
        drawText('?', 130);
    
        let captcha;
        switch(oper) {
            case 0: 
                captcha = fir + sec;
                break;
            case 1:
                captcha = fir - sec;
                break;
            case 2:   
                captcha = fir * sec;
                break;
        }
        const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: '測謊機.png' });
        return await interaction.editReply({ files: [attachment], content: `測試`})
    },
};