const Command = require('../../Core/command');

module.exports = class HelpCommand extends Command {
    constructor(main){
        super(main, {
            name: "help",
            category: "信息",
            help: "顯示所有指令, 以及指令的詳細信息!",
            args: [
                {
                    name: "[可選填]指令名稱",
                    desc: "如果該值為空, 將顯示所有指令"
                }
            ]
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        args = args.join(' ');
        if((args = this.main.commands.get(args)) && !args.devOnly){
            let helpCommandMSG = this.main.util.createEmbed(message.author, `${args.help.title}`, `${args.help.description}`);
            args.help.fields.forEach(item => {
                helpCommandMSG.fields.push({
                    name: item.name,
                    value: item.value
                });
            })
            try{
                await this.main.util.SDM(message.channel, helpCommandMSG, message.author);
            } catch (err){
                console.log(err);
            }
        } else{
            let helpMSG = this.main.util.createEmbed(message.author, "指令列表", `使用 \`${prefix}help <指令>\` 以查看更多該指令的詳細信息!`);
            let categories = {};
            this.main.commands.forEach(item => {
                if(!item.devOnly){
                    if(!categories[item.category]) categories[item.category] = [];
                    categories[item.category].push(item.name);
                 }
            });
            for(let item in categories) {
                let ctg = [[]];
                let index = 0;
                categories[item].forEach(command => {
                    args = `${ctg[index].join(', ')}, [${command}]`;
                    if(args.length > 1024) {
                        index++;
                        ctg[index] = [];
                    }
                    ctg[index].push(`[${command}]`);
                });
                ctg.forEach((command, index) => {
                    if (ctg.length > 1) index = `${item} (${index + 1})`;
                    else index =item;
                    helpMSG.fields.push({
                        name: index,
                        value: command.join(', ')
                    });
                });
            }
            try{
                await this.main.util.SDM(message.channel, helpMSG, message.author);
            } catch (err){
                console.log(err);
            }
        }
    }
}