const Command = require('../../Core/command');

// require("../../Core/ExtendedMessage.js");

module.exports = class Dmorse extends Command {
    constructor(main){
        super(main, {
            name: "dmorse",
            category: "功能性",
            help: "解密信息",
            args: [{
                name: "Message ID",
                desc: "Discord 信息16位ID"
            }],
            caseSensitive: true
        });
        this.morseCode = {".-": "a", "-...":"b", "-.-.": "c", "-..": "d", ".":"e", "..-.":"f", "--.":"g", "....":"h", "..":"i", ".---":"j", "-.-":"k", ".-..":"l", "--":"m", "-.":"n", "---":"o", ".--.":"p", "--.-":"q", ".-.":"r", "...":"s", "-":"t", "..-":"u", "...-":"v", ".--":"w", "-..-":"x", "-.--":"y", "--..":"z", ".----":"1", "..---":"2", "...--":"3", "....-":"4", ".....":"5", "-....":"6", "--...":"7", "---..":"8", "----.":"9", "-----":"0", "|":" "};

    }
    async run(message, args, prefix){
        message.delete().catch();
        try{
            message.channel.messages.fetch(args[0]).then(msg => {
                let tString = this.decodeMorse(msg.content);
                let doneMSG = this.main.util.createEmbed(message.author, `ReiNa Bot Rework [2021/03/14 03:12 DiscordAPI 試驗性]`, tString);
                msg.inlineReply(msg.author, { embed: doneMSG });
                // this.main.util.SDM(message.channel, msg.author + doneMSG, message.author)
            })
        }catch(e){}
    }
    decodeMorse = function(morseCode){
        var words = (morseCode).split('  ');
        var letters = words.map((w) => w.split(' '));
        var decoded = [];
        for(var i = 0; i < letters.length; i++){
            decoded[i] = [];
            for(var x = 0; x < letters[i].length; x++){
                if(this.morseCode[letters[i][x]]){
                    decoded[i].push( this.morseCode[letters[i][x]] );
                }
            }
        }
        return decoded.map(arr => arr.join('')).join(' ');
    }
    
}