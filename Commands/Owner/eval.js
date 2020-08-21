const Command = require('../../Core/command');
const { inspect } = require('util');

module.exports = class EvalCommand extends Command {
    constructor(main){
        super(main, {
            name: "eval",
            category: "擁有者限定",
            help: "運算",
            args: [{
                name: "String",
                desc: "需要運算的字串"
            }],
            caseSensitive: true
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        if(this.main.util.checkOwner(message.author)){
            let toEval = args.join(" ");
            try{
                let evaluated = inspect(eval(toEval, { depth: 0} ))

                if(!toEval) {
                    let NothingEval = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author}, 請輸入參數!`);
                    try{
                        this.main.util.SDM(message.channel, NothingEval, message.author);
                    }catch(e){}
                    return;
                } else {
                    let hrStart = process.hrtime();
                    let hrDiff;
                    hrDiff = process.hrtime(hrStart);
                    let Evaled = this.main.util.createEmbed(message.author, `ReiNa Bot Rework Eval`, `*處理時間: ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.*`);
                    Evaled.addField('輸入', `\`\`\`js\n${toEval}\n\`\`\``);
                    Evaled.addField('輸出', `\`\`\`javascript\n${evaluated}\n\`\`\``);
                    if((toEval.length + evaluated.length + 4) > 1023){
                        let errMSG = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 哎呀, 出錯啦!`);
                        errMSG.addField('輸入', `\`\`\`js\n${toEval}\n\`\`\``);
                        errMSG.addField('輸出', `回報字串長度超過1024 無法輸出到 Discord (這只是回報Discord Embed限制字元錯誤 eval的值沒有發生錯誤)`);
                        try{
                            this.main.util.SDM(message.channel, errMSG, message.author);
                        }catch(e){}
                    }else{
                        try{
                            this.main.util.SDM(message.channel, Evaled, message.author);
                        }catch(e){}
                    }
                }
            }catch(e){
                if(e.message.length <= 1023){
                    let errMSG = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 哎呀, 出錯啦!`);
                    errMSG.addField('輸入', `\`\`\`js\n${toEval}\n\`\`\``);
                    errMSG.addField("eval 錯誤", `${e.message}`);
                    try{
                        this.main.util.SDM(message.channel, errMSG, message.author);
                    }catch(e){}
                }else{
                    let errMSG = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 哎呀, 出錯啦!`);
                    errMSG.addField('輸入', `\`\`\`js\n${toEval}\n\`\`\``);
                    errMSG.addField("eval 錯誤", `錯誤信息字串長度超過1024 無法輸出到 Discord`);
                    try{
                        this.main.util.SDM(message.channel, errMSG, message.author);
                    }catch(e){}
                }
            }
        }else{
            let noPerm = this.main.util.createEmbed(message.author, null, `${message.author}, 你的權限不足! 無法執行運算!`);
            try{
                this.main.util.SDM(message.channel, noPerm, message.author);
            }catch(e){}
        }
    }
}