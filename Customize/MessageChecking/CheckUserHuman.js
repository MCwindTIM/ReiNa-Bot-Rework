const Discord = require('discord.js')
const Canvas = require('canvas');

module.exports.run = async (ReiNa, message) =>{
	message.delete().catch();
	let kitisgay = message.member;
	let array = [ kitisgay.id ]
	const canvas = Canvas.createCanvas(100, 30);
	const ctx = canvas.getContext('2d');
	const blankbg = await Canvas.loadImage('./Customize/MessageChecking/Images/blankbg.jpg');
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

		for(let i = 0; i < num; i++){
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
	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), '測謊機.png');
	message.channel.send({ content: `${kitisgay}, 請在十秒內輸入算式答案以獲得**一般成員**權限!`, files: [attachment]}).then(msg => {
		setTimeout(() => msg.delete().catch(console.log), 10000);
	}).catch(console.log);
	try {
		var response;
		const filter = m => m.content > captcha - 1 && m.content < captcha + 1 && array.includes(m.author.id);
		await message.channel.awaitMessages({filter: filter, max: 1, time: 10000, errors: ['time']}).then(fetched => {
			response = fetched;
		});
	} catch (err) {
        let png = canvas.createPNGStream();
        let notpass = ReiNa.util.createEmbed(message.author, `ReiNa Bot Rework 驗證錯誤`, `${kitisgay} 驗證碼錯誤 / 超過輸入時間!`, null, 0xcc0000);
		message.channel.send({embeds: [notpass]}).then(msg => {
			setTimeout(() => msg.delete().catch(console.log), 5000);
		});
		return;
        }
    let pass = ReiNa.util.createEmbed(message.author, null, `${kitisgay}通過驗證!`, null, 0xcc0000);
	await message.member.roles.add('702950415045754880');
	await message.member.roles.remove('702950614195241053');
	await message.channel.send({embeds: [pass]}).then(msg => {
		setTimeout(() => msg.delete().catch(console.log), 1500);
	});
	return;
}

module.exports.name = "驗證";
