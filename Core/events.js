const Canvas = require('canvas');
const Discord = require("discord.js")
const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;
    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);
    return ctx.font;
};
module.exports = class Events {
    constructor(main){
        this.main = main;
        // this.timerObj = []; //FIXME: not working, too many bugs
        //Discord Events
        this.main.bot
        .on(Discord.Events.ClientReady, readyClient => {
            process.title = `${this.main.bot.user.tag} - Discord ReiNa Bot Rework`;
            console.log(`${this.main.bot.user.tag}上線!`);
            console.log(`${this.main.util.emoji.time} ${Date.now() - this.main.finishLoad}ms`);
            this.main.loginTime = new Date().toString();
            this.main.util.setActivity(this.main);
            setInterval(() => {
                this.main.util.setActivity(this.main);
            }, 60000);

        })
        .on(Discord.Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;            
            if(interaction.isButton()) {
                const button = this.main.buttons.get(interaction.customId);
                
                if (!button) return console.error(`找不到交互按鈕 ${this.main.util.emoji.this} ${interaction.customId} .`);
                try {
                    await button.run(this.main, interaction);
                } catch (error) {
                    console.error(error);
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: `${this.main.util.emoji.error} 哎呀! 出錯啦!`, ephemeral: true });
                    } else {
                        await interaction.reply({ content: `${this.main.util.emoji.error} 哎呀! 出錯啦!`, ephemeral: true });
                    }
                }
            }

            if(interaction.isCommand()){
                const command = this.main.commands.get(interaction.commandName);
                
                if (!command) return console.error(`找不到指令 ${this.main.util.emoji.this} ${interaction.commandName} .`);

                try {
                    console.log(`${this.main.util.getTime()}${this.main.util.emoji.user} ${interaction.member.displayName}(${interaction.user.id}) | ${this.main.util.emoji.channel} ${interaction.channel.name}(${interaction.channel.id}) | ${this.main.util.emoji.file} ${command.data.name}) `)
                    await command.run(this.main, interaction);
                } catch (error) {
                    console.error(error);
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: `${this.main.util.emoji.error} 哎呀! 出錯啦!`, ephemeral: true });
                    } else {
                        await interaction.reply({ content: `${this.main.util.emoji.error} 哎呀! 出錯啦!`, ephemeral: true });
                    }
                }
            }
        })
        .on(Discord.Events.GuildMemberAdd, async member => {
            const channel = member.guild.systemChannel;
            if(!channel) return;
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext('2d');
            const bg = await Canvas.loadImage('./Src/welcome.jpg');
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

            const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'png'}));
            ctx.drawImage(avatar, 25, 25, 200, 200);
            let attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: 'Welcome-image.png'});
            channel.send({content: `?! 是野生的 ${member}！ 🎉歡迎加入 **${member.guild.name}**！🎊 :wink: `, files: [attachment]});
        })
        .on(Discord.Events.GuildMemberRemove, async member => {
            const channel = member.guild.systemChannel;
            if(!channel) return;
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext('2d');
            const bg = await Canvas.loadImage('./Src/bye.jpg');
            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            const avatar = await Canvas.loadImage(member.user.displayAvatarURL({extension: 'png'}));
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
            const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: 'bye.png'});
        
            channel.send({content: `${member.user.tag} 逃離了**${member.guild.name}**.`, files: [attachment]});
        });
        //Music Events
        this.main.bot.distube
        // .on('addSong', (queue, song) => {
        //     queue.textChannel.send(
        //     `${this.main.util.emoji.success} | ${song.user} 已添加 \`${song.name}\` - *\`${song.formattedDuration}\`* 到播放列表. `
        //     )
        // })
        .on('playSong', (queue, song) => {
            console.log(`${this.main.util.emoji.music} ${song.name}`+
            ` | ${this.main.util.emoji.user} ${song.user.globalName}(${song.user.id})`+
            ` | ${this.main.util.emoji.channel} ${this.main.bot.channels.cache.get(queue.voice.channelId).name}(${queue.voice.channelId})`);

            // queue.textChannel.send(
            // `${this.main.util.emoji.play} | 開始播放 ${song.user} 的 \`${song.name}\` - *\`${song.formattedDuration}\`*\
            // \n${this.main.util.status(queue)}`
            // )
        })
        // .on("deleteQueue", async (queue) => {
        //     //update message
        //     let nullMSG = this.main.util.createEmbed(this.main.queue.get(queue.id).message.author, `${this.main.util.emoji.error} | 錯誤`, `清單是空的`, null, this.main.util.color.red, null, null, null, null);
        //     await this.main.queue.get(queue.id).message.edit({embeds: [nullMSG]});
        //     await this.main.queue.get(queue.id).confirmation.update({components: []});
        //     //clear Interval timer
        //     clearInterval(this.main.queue.get(queue.id).timer);

        //     //remove map
        //     await this.main.queue.delete(queue.id);
        // });
    }
}