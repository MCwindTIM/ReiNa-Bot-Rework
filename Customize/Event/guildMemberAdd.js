const Canvas = require('canvas');
const Discord = require('discord.js');
const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);

    return ctx.font;
};

module.exports.sendWelcomeMessage = async (member) => {
    const channel = member.guild.systemChannel;
    if(!channel) return;

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const bg = await Canvas.loadImage('./Customize/Event/Images/wallpaper.jpg');
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = '28px MCwindFont';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`歡迎加入本伺服器!`, canvas.width / 2.5, canvas.height / 3.5);
    
    ctx.font = applyText(canvas, `${member.displayName} !`);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${member.displayName} !`, canvas.width / 2.5, canvas.height / 1.8);


    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL());
    ctx.drawImage(avatar, 25, 25, 200, 200);
    let attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'Welcome-image.png');
    channel.send(`?! 是野生的 ${member}！ 🎉歡迎加入 **${member.guild.name}**！🎊 :wink: `, attachment);
}