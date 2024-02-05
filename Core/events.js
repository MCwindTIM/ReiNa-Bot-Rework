const Discord = require("discord.js")

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
                consol.log(true)
            }
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