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
        let line = `        　　  ${imposter.username} was The Impostor.　 。　.`;;
        let pattern = `
        . 　　　。　　　　•　 　ﾟ　　。 　　.

        　　　.　　　 　　.　　　　　。　　 。　. 　

        .　　 。　　　　　 ඞ 。 . 　　 • 　　　　•

${line}

        　　'　　　 1 Impostor remains 　 　　。

        　　ﾟ　　　.　　　. ,　　　　.`;

        
        message.channel.send(pattern);
    }
}