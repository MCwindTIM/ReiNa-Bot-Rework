const Discord = require('discord.js');
// const youtubeRegex = /(?:.+?)?(?:\/v\/|watch\/|\?v=|\&v=|youtu\.be\/|\/v=|^youtu\.be\/|watch\%3Fv\%3D)([a-zA-Z0-9_-]{11})+/g;
// const spotifyRegex = /^(https:\/\/open.spotify.com\/user\/([a-zA-Z0-9]+)\/playlist\/|spotify:user:([a-zA-Z0-9]+):playlist:)([a-zA-Z0-9]+)(.*)$/g;

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('play')
		.setDescription('播放音樂')
        .addStringOption(input => 
            input.setName(`url`)
                .setDescription('YouTube/Spotify/SoundCloud連結/關鍵字')
                .setRequired(true)),
	async run(ReiNa, interaction) {
        await interaction.deferReply();
        const url = interaction.options.get("url").value;

        if(!interaction.member.voice?.channel){
            const vcNull = ReiNa.util.createEmbed(interaction.user, `${ReiNa.util.emoji.error} | 錯誤`, `${interaction.member}, 你未加入任何屬於此伺服器的語音頻道`, null, ReiNa.util.color.red);   
            return await interaction.editReply({ embeds: [vcNull]});
        }
        // #response : music control menu
        let response;
        
        //check playing song with queue
        const queue = ReiNa.bot.distube.getQueue(interaction);
        if(!queue) {
            await ReiNa.bot.distube.play(interaction.member.voice.channel, url, {
                textChannel: ReiNa.bot.channels.cache.get(interaction.channelId),
                member: interaction.member
            });
            // get the updated queue
            const updatedQueue = ReiNa.bot.distube.getQueue(interaction);
            //reply with music control
            const musicEmbed = await ReiNa.util.getMusicEmbed(interaction);
            response = await interaction.editReply({ embeds: [musicEmbed], components: [ ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
            
            //add timer to update musicPanel for each 5 seconds
            const timer = setInterval(async () => {
                if(updatedQueue === undefined || updatedQueue.songs.length === 0){
                    let nullMSG = ReiNa.util.createEmbed(interaction.user, `${ReiNa.util.emoji.thanks} | 播放完畢`, `**感謝你使用此服務!**\n\n這是一個開源專案, 你可以到 [Github](https://github.com/MCwindTIM/ReiNa-Bot-Rework) 查看我的源代碼!`, null, ReiNa.util.color.pink, null, null, null, null);
                    await response.edit({embeds: [nullMSG], components: []});
                    await clearInterval(ReiNa.queue.get(updatedQueue.id).timer);
                    return await ReiNa.queue.delete(updatedQueue.id);
                }
                const musicEmbed = await await ReiNa.util.getMusicEmbed(interaction);
                await response.edit({ embeds: [musicEmbed], components: [ ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
            }, 15000)
            ReiNa.queue.set(interaction.guildId, {
                "message": response,
                "timer": timer
            });
            //followUp with add queue message
            let addSongMSG = await ReiNa.util.createEmbed(interaction.user, `${ReiNa.util.emoji.music} **添加到播放清單** __(此信息15秒後自動刪除)__`, `[${updatedQueue.songs[0].name}](${updatedQueue.songs[0].url})`, `music`, ReiNa.util.color.green, null, null, null, updatedQueue.songs[0].thumbnail);
            addSongMSG.addFields(
                {name: `點播用戶`, value: `<@${interaction.user.id}>`, inline: true},
                {name: `音樂時長`, value: `\`${updatedQueue.songs[0].formattedDuration}\``, inline: true},
                {name: `歌單時長`, value: `${updatedQueue.songs.length} 首歌 - \`${updatedQueue.formattedDuration}\``, inline: true},
            )
            await interaction.followUp({ embeds: [addSongMSG]}).then(msg => {
                setTimeout(() => msg.delete(), 15000)
            }).catch();
        }
        else{
            await ReiNa.bot.distube.play(interaction.member.voice.channel, url, {
                textChannel: ReiNa.bot.channels.cache.get(interaction.channelId),
                member: interaction.member
            });
            // get the updated queue
            const updatedQueue = ReiNa.bot.distube.getQueue(interaction);
            //get last song from queue
            const lastSong = updatedQueue.songs.slice(-1)[0];
            //reply with add queue message
            let addSongMSG = ReiNa.util.createEmbed(interaction.user, `${ReiNa.util.emoji.music} **添加到播放清單** __(此信息15秒後自動刪除)__`, `[${lastSong.name}](${lastSong.url})`, `music`, ReiNa.util.color.green, null, null, null, lastSong.thumbnail);
            addSongMSG.addFields(
                {name: `點播用戶`, value: `<@${interaction.user.id}>`, inline: true},
                {name: `音樂時長`, value: `\`${updatedQueue.songs[0].formattedDuration}\``, inline: true},
                {name: `歌單時長`, value: `${updatedQueue.songs.length} 首歌 - \`${updatedQueue.formattedDuration}\``, inline: true},
            )
            return await interaction.editReply({ embeds: [addSongMSG]}).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            }).catch();
        }

        //Components collector
        try {
                //Only who use command can react to buttons (05-Feb-24 added all user can react,
                //should remove the filter instead, only reason this still hereis keeping for debug)
                const collectorFilter = i => i.user.id === interaction.user.id || i.user.id != interaction.user.id;
                const collector = await response.createMessageComponentCollector({
                    filter: collectorFilter, 
                    time: 1000 * 60 * 60 * 24,
                    componentType: Discord.ComponentType.Button,
                });
                collector.on(`collect`, async (cInteraction) => {
                    const updatedQueue = ReiNa.bot.distube.getQueue(cInteraction); 

                    if (cInteraction.customId === 'musicPlay') {
                        if(updatedQueue === undefined || updatedQueue.songs.length === 0){
                            let nullMSG = ReiNa.util.createEmbed(collector.user, `${ReiNa.util.emoji.error} | 錯誤`, `清單是空的`, null, ReiNa.util.color.red, null, null, null, null);
                            await response.edit({embeds: [nullMSG]});
                            return await cInteraction.update({components: []});
                        }
                        //play music
                        if (!updatedQueue.playing){
                            await updatedQueue.resume(cInteraction);
                            //get update music emebed
                            const musicEmbed = await ReiNa.util.getMusicEmbed(cInteraction);
                            await response.edit({embeds: [musicEmbed]});
                        }    
                        await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                    } 
                    if (cInteraction.customId === 'musicPause') {
                        if(updatedQueue === undefined || updatedQueue.songs.length === 0){
                            let nullMSG = ReiNa.util.createEmbed(cInteraction.user, `${ReiNa.util.emoji.error} | 錯誤`, `清單是空的`, null, ReiNa.util.color.red, null, null, null, null);
                            await response.edit({embeds: [nullMSG]});
                            return await cInteraction.update({components: []});
                        }
                        //pause music
                        if(!updatedQueue.paused){
                            await updatedQueue.pause(cInteraction);
                            //get update music emebed
                            const musicEmbed = await ReiNa.util.getMusicEmbed(cInteraction);
                            await response.edit({embeds: [musicEmbed]});
                        }
                        await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                    }  
                    if(cInteraction.customId === 'musicStop'){
                        if(updatedQueue === undefined || updatedQueue.songs.length === 0){
                            let nullMSG = ReiNa.util.createEmbed(cInteraction.user, `${ReiNa.util.emoji.error} | 錯誤`, `清單是空的`, null, ReiNa.util.color.red, null, null, null, null);
                            await response.edit({embeds: [nullMSG]});
                            return await cInteraction.update({components: []});
                        }
                        //stop music
                        await updatedQueue.stop();
                        const stopMSG = ReiNa.util.getMusicEmbed(cInteraction, true);
                        await response.edit({embeds: [stopMSG]});
                        return await cInteraction.update({components: []});
                    }
                    if(cInteraction.customId === 'musicUpVolume'){
                        if(updatedQueue === undefined || updatedQueue.songs.length === 0){
                            let nullMSG = ReiNa.util.createEmbed(cInteraction.user, `${ReiNa.util.emoji.error} | 錯誤`, `清單是空的`, null, ReiNa.util.color.red, null, null, null, null);
                            await response.edit({embeds: [nullMSG]});
                            return await cInteraction.update({components: []});
                        }
                        //tune up volume
                        updatedQueue.setVolume(
                            updatedQueue.volume + 10
                        )
                        const musicEmbed = await ReiNa.util.getMusicEmbed(cInteraction);
                        await response.edit({embeds: [musicEmbed]});
                        await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                    }
                    if(cInteraction.customId === 'musicDownVolume'){
                        if(updatedQueue === undefined || updatedQueue.songs.length === 0){
                            let nullMSG = ReiNa.util.createEmbed(cInteraction.user, `${ReiNa.util.emoji.error} | 錯誤`, `清單是空的`, null, ReiNa.util.color.red, null, null, null, null);
                            await response.edit({embeds: [nullMSG]});
                            return await cInteraction.update({components: []});
                        }
                        //tune down volume
                        updatedQueue.setVolume(
                            updatedQueue.volume - 10
                        )
                        const musicEmbed = await ReiNa.util.getMusicEmbed(cInteraction);
                        await response.edit({embeds: [musicEmbed]});
                        await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                    }
                    if(cInteraction.customId === 'musicPrevious'){
                        if(!updatedQueue?.previousSongs?.length != 0){
                            let nullMSG = ReiNa.util.createEmbed(cInteraction.user, `${ReiNa.util.emoji.error} | 錯誤`, `歷史清單是空的 (沒有上一首歌)`, null, ReiNa.util.color.red, null, null, null, null);
                            await response.edit({embeds: [nullMSG]});
                            await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                        }
                        else{
                            if(updatedQueue === undefined || updatedQueue.songs.length === 0){
                                let nullMSG = ReiNa.util.createEmbed(cInteraction.user, `${ReiNa.util.emoji.error} | 錯誤`, `清單是空的`, null, ReiNa.util.color.red, null, null, null, null);
                                await response.edit({embeds: [nullMSG]});
                                return await cInteraction.update({components: []});
                            }
                            await updatedQueue.previous();
                            const musicEmbed = await ReiNa.util.getMusicEmbed(cInteraction);
                            await response.edit({embeds: [musicEmbed]});
                            await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                        }
                    }
                    if(cInteraction.customId === 'musicRewinding'){
                        if(updatedQueue === undefined || updatedQueue.songs.length === 0){
                            let nullMSG = ReiNa.util.createEmbed(cInteraction.user, `${ReiNa.util.emoji.error} | 錯誤`, `清單是空的`, null, ReiNa.util.color.red, null, null, null, null);
                            await response.edit({embeds: [nullMSG]});
                            return await cInteraction.update({components: []});
                        }
                        await updatedQueue.seek(
                            updatedQueue.currentTime - 30 <= 0 ?
                            0 : updatedQueue.currentTime - 30
    
                        )
                        const musicEmbed = await ReiNa.util.getMusicEmbed(cInteraction);
                        await response.edit({embeds: [musicEmbed]});
                        await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                    }
                    if(cInteraction.customId === 'musicFastForward'){
                        if(updatedQueue === undefined || updatedQueue.songs.length === 0){
                            let nullMSG = ReiNa.util.createEmbed(cInteraction.user, `${ReiNa.util.emoji.error} | 錯誤`, `清單是空的`, null, ReiNa.util.color.red, null, null, null, null);
                            await response.edit({embeds: [nullMSG]});
                            return await cInteraction.update({components: []});
                        }
                        const playingSong = updatedQueue.songs[0];
                        await updatedQueue.seek(
                            updatedQueue.currentTime + 30 >= playingSong.duration ?
                            playingSong.duration - 2 :
                            updatedQueue.currentTime + 30
                        )
                        const musicEmbed = await ReiNa.util.getMusicEmbed(cInteraction);
                        await response.edit({embeds: [musicEmbed]});
                        await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                    }
                    if(cInteraction.customId === 'musicNext'){
                        if(!(updatedQueue?.songs?.length >= 2)){
                            let nullMSG = ReiNa.util.createEmbed(cInteraction.user, `${ReiNa.util.emoji.error} | 錯誤`, `沒有下一首音樂, 請使用 </play:1201204129951907942> 加入音樂`, null, ReiNa.util.color.red, null, null, null, null);
                            await response.edit({embeds: [nullMSG]});
                            await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                        }
                        else{
                            await updatedQueue.skip();
                            const musicEmbed = await ReiNa.util.getMusicEmbed(cInteraction);
                            await response.edit({embeds: [musicEmbed]});
                            await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                        }
                    }
                    if(cInteraction.customId === "musicRepeat"){
                        if(updatedQueue === undefined || updatedQueue.songs.length === 0){
                            let nullMSG = ReiNa.util.createEmbed(cInteraction.user, `${ReiNa.util.emoji.error} | 錯誤`, `清單是空的`, null, ReiNa.util.color.red, null, null, null, null);
                            await response.edit({embeds: [nullMSG]});
                            return await cInteraction.update({components: []});
                        }
    
                        updatedQueue.setRepeatMode();
                        const musicEmbed = await ReiNa.util.getMusicEmbed(cInteraction);
                        await response.edit({embeds: [musicEmbed]});
                        await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                    }

                    if(cInteraction.customId === "musicQueue"){
                        if(updatedQueue === undefined || updatedQueue.songs.length === 0){
                            let nullMSG = ReiNa.util.createEmbed(cInteraction.user, `${ReiNa.util.emoji.error} | 錯誤`, `清單是空的`, null, ReiNa.util.color.red, null, null, null, null);
                            await response.edit({embeds: [nullMSG]});
                            return await cInteraction.update({components: []});
                        }

                        const queueEmbed = await ReiNa.util.getQueueEmbed(cInteraction);
                        await response.edit({embeds: [queueEmbed]});
                        await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                    }

                    if(cInteraction.customId === "musicRefresh"){
                        if(updatedQueue === undefined || updatedQueue.songs.length === 0){
                            let nullMSG = ReiNa.util.createEmbed(cInteraction.user, `${ReiNa.util.emoji.error} | 錯誤`, `清單是空的`, null, ReiNa.util.color.red, null, null, null, null);
                            await response.edit({embeds: [nullMSG]});
                            return await cInteraction.update({components: []});
                        }
                        const musicEmbed = await ReiNa.util.getMusicEmbed(interaction);
                        await response.edit({embeds: [musicEmbed]});
                        await cInteraction.update({components: [ReiNa.rows.musicPanelRow, ReiNa.rows.musicPanelRow2, ReiNa.rows.musicPanelRow3]});
                    }
                })
        } catch (e) {
            if(!e.message.includes(`time`)){
                console.log(e);
                const errorMSG = ReiNa.util.createEmbed(interaction.user, `${ReiNa.util.emoji.error} | 發生錯誤啦`, `${e.message}`, null, ReiNa.util.color.red);
                response.edit({embeds: [errorMSG], components: []});
            }
            return await response.edit( { components: [] } );
        }
	},
};