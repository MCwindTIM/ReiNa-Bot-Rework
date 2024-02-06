const Discord = require("discord.js")

module.exports = class Rows {
    constructor(main){
        this.main = main;

        //Discord buttons

        //Music menu buttons
        this.playButton = new Discord.ButtonBuilder()
            .setCustomId('musicPlay')
            .setLabel(`${this.main.util.emoji.play}`)
            .setStyle(Discord.ButtonStyle.Secondary),

        this.pauseButton = new Discord.ButtonBuilder()
            .setCustomId('musicPause')
            .setLabel(`${this.main.util.emoji.pause}`)
            .setStyle(Discord.ButtonStyle.Secondary);

        this.upVolumeButton = new Discord.ButtonBuilder()
            .setCustomId('musicUpVolume')
            .setLabel(`${this.main.util.emoji.highVolume} +10%`)
            .setStyle(Discord.ButtonStyle.Secondary);

        this.downVolumeButton = new Discord.ButtonBuilder()
            .setCustomId('musicDownVolume')
            .setLabel(`${this.main.util.emoji.lowVolume} -10%`)
            .setStyle(Discord.ButtonStyle.Secondary);
            
        this.repeatButton = new Discord.ButtonBuilder()
            .setCustomId('musicRepeat')
            .setLabel(`${this.main.util.emoji.repeat}`)
            .setStyle(Discord.ButtonStyle.Secondary);

        this.stopButton = new Discord.ButtonBuilder()
            .setCustomId('musicStop')
            .setLabel(`${this.main.util.emoji.stop}`)
            .setStyle(Discord.ButtonStyle.Secondary);

        this.previousButton = new Discord.ButtonBuilder()
            .setCustomId("musicPrevious")
            .setLabel(`${this.main.util.emoji.previous}`)
            .setStyle(Discord.ButtonStyle.Secondary);
        
        this.rewindButton = new Discord.ButtonBuilder()
            .setCustomId("musicRewinding")
            .setLabel(`${this.main.util.emoji.rewinding} 30秒`)
            .setStyle(Discord.ButtonStyle.Secondary);

        this.fastForwardButton = new Discord.ButtonBuilder()
            .setCustomId("musicFastForward")
            .setLabel(`${this.main.util.emoji.fastForward} 30秒`)
            .setStyle(Discord.ButtonStyle.Secondary);

        this.nextButton = new Discord.ButtonBuilder()
            .setCustomId("musicNext")
            .setLabel(`${this.main.util.emoji.next}`)
            .setStyle(Discord.ButtonStyle.Secondary);
        
        this.queueButton = new Discord.ButtonBuilder()
            .setCustomId('musicQueue')
            .setLabel(`${this.main.util.emoji.queue}`)
            .setStyle(Discord.ButtonStyle.Secondary);

        this.refreshButton = new Discord.ButtonBuilder()
            .setCustomId('musicRefresh')
            .setLabel(`${this.main.util.emoji.refresh} 更新`)
            .setStyle(Discord.ButtonStyle.Success);

        //test
        this.firstButton = new Discord.ButtonBuilder()
            .setCustomId('first')
            .setLabel('1')
            .setStyle(Discord.ButtonStyle.Secondary);
        this.secondButton = new Discord.ButtonBuilder()
            .setCustomId('second')
            .setLabel('2')
            .setStyle(Discord.ButtonStyle.Secondary);
            
        //Queue Menu
        this.nextPageButton = new Discord.ButtonBuilder()
            .setCustomId('nextPage')
            .setLabel(`${this.main.util.emoji.play} 下一頁`)
            .setStyle(Discord.ButtonStyle.Secondary);

        this.previousPageButton = new Discord.ButtonBuilder()
            .setCustomId('previousPage')
            .setLabel(`${this.main.util.emoji.left} 上一頁`)
            .setStyle(Discord.ButtonStyle.Secondary);
        
        //Row (A collection of buttons. Max buttons for a row is up to 5);
        this.musicPanelRow = new Discord.ActionRowBuilder().addComponents(
            this.playButton,
            this.pauseButton,
            this.stopButton,
            this.downVolumeButton,
            this.upVolumeButton,
        );
        
        this.musicPanelRow2 = new Discord.ActionRowBuilder().addComponents(
            this.previousButton,
            this.rewindButton,
            this.fastForwardButton,
            this.nextButton,
            this.repeatButton,
        );

        this.musicPanelRow3 = new Discord.ActionRowBuilder().addComponents(
            this.queueButton,
            this.refreshButton,
        );

        this.queuePanel = new Discord.ActionRowBuilder().addComponents(
            this.previousPageButton,
            this.nextPageButton
        )

        this.testRow = new Discord.ActionRowBuilder().addComponents(
            this.playButton,
            this.pauseButton
        );
    }
}