const Command = require('../../Core/command');

module.exports = class ImposterCommand extends Command {
    constructor(main){
        super(main, {
            name: "imposter",
            category: "測試",
            help: "",
            args: []
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        let imposter = message.mentions.users.first();
        if(!imposter){
            imposter = message.author;
        }
        let line;
        if(imposter.username.length <= 15){
            line = `        　　        ${imposter.username} was The Impostor.　 。　.`;
        }else{
            line = `        　　       ${imposter.username}\n        　　         was The Impostor.　 。　.`.substring(imposter.username.length - 6);
        }
        let pattern = `. 　　　。　　　　•　 　ﾟ　　。 　　.

        　　　.　　　 　　.　　　　　。　　 。　. 　
        
        .　　 。　　　　　 ඞ 。 . 　　 • 　　　　•
        
        ${line}
        
        　　'　　　 1 Impostor remains 　 　　。
        
        　　ﾟ　　　.　　　. ,　　　　.`;

        
        message.channel.send(pattern);
    }

    pad(pad, str, padLeft) {
        if (typeof str === 'undefined') 
          return pad;
        if (padLeft) {
          return (pad + str).slice(-pad.length);
        } else {
          return (str + pad).substring(0, pad.length);
        }
      }
}