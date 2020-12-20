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

module.exports.sendByeMessage = async (member) => {
    const channel = member.guild.systemChannel;
    if(!channel) return;

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    const bg = await Canvas.loadImage('./Customize/Event/Images/meme.jpg');
    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: 'png'}));
    ctx.drawImage(avatar, 150, 30, 150, 150);
    var pixels = ctx.getImageData(150, 30, 150, 150);
    var pixeldata = pixels.data;
    for(var i = 0;i < pixeldata.length;i += 4){ 
        var grey = Math.floor(( pixels.data[i] + pixels.data[i+1] + pixels.data[i+2])/3); 
            pixels.data[i] = grey; 
            pixels.data[i+1] = grey; 
            pixels.data[i+2] = grey;
    }
    ctx.putImageData(pixels, 150, 30);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'bye.png');

    channel.send(`${member.user.tag} 逃離了**${member.guild.name}**.`, attachment);
}