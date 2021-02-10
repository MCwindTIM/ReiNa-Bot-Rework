const Command = require('../../Core/command');
const { inspect } = require('util');
const fs = require('fs');
const request = require('request');
const path = require('path');
const {spawn} = require('child_process');

module.exports = class PyCommand extends Command {
    constructor(main){
        super(main, {
            name: "py",
            category: "擁有者限定",
            help: "運算",
            args: [{
                name: "String",
                desc: "需要運算的字串/python檔案"
            }],
            caseSensitive: true
        });
    }
    async run(message, args, prefix){
        let hrStart = process.hrtime();
        //message.delete().catch(); not to delete the message until make sure no message attachments [*.py];
        if(this.main.util.checkUserPerm(message.author.id)){
            let toEval = args.join(" ");
            let file = message.attachments.get(message.attachments.keys().next().value) ? true : false;
            try{
                if(!toEval && !file) {
                    let NothingEval = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author}, 請輸入參數!`);
                    try{
                        this.main.util.SDM(message.channel, NothingEval, message.author);
                    }catch(e){}
                    return;
                } else {
                    if(!file){
                        let filename = `messageScript.py`;
                        fs.writeFile(`./PyScript/${filename}`, toEval, (err) => {
                            message.delete().catch();
                            const python = spawn('python', [`./PyScript/${filename}`]);
                            python.stdout.on('data', (data) => {
                                let evaluated = data.toString();
                                let hrDiff;
                                hrDiff = process.hrtime(hrStart);
                                let Evaled = this.main.util.createEmbed(message.author, `ReiNa Bot Rework Eval`, `*處理時間: ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms. 如果輸入/輸出字串長度大於1024, 只會顯示1024個字元*`);
                                Evaled.addField('輸入', `\`\`\`py\n${toEval.substr(0, (1024 - 10))}\`\`\``);
                                Evaled.addField('輸出', `\`\`\`py\n${evaluated.substr(0, (1024 - 10))}\`\`\``);
                                try{
                                    this.main.util.SDM(message.channel, Evaled, message.author);
                                }catch(e){}
                            });
                            python.stderr.on('data', (data) => {
                                let errMSG = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 哎呀, 出錯啦! *如果輸入/輸出字串長度大於1024, 只會顯示1024個字元*`);
                                errMSG.addField('輸入', `\`\`\`py\n${toEval.substr(0, (1024 - 10))}\n\`\`\``);
                                errMSG.addField("eval 錯誤", `${data.toString().substr(0, (1024 - 10))}`);
                                try{
                                    this.main.util.SDM(message.channel, errMSG, message.author);
                                }catch(e){}
                            });
                          }); 
                    }else{
                        let url = message.attachments.get(message.attachments.keys().next().value).url;
                        if(url.endsWith(".py")){
                            let filename = path.basename(url);
                            let wStream = fs.createWriteStream(`./PyScript/${filename}`);
                            wStream.on('finish', () => {
                                message.delete().catch();
                                const python = spawn('python', [`./PyScript/${filename}`]);
                                python.stdout.on('data', (data) => {
                                    let evaluated = data.toString();
                                    let hrDiff;
                                    hrDiff = process.hrtime(hrStart);
                                    let Evaled = this.main.util.createEmbed(message.author, `ReiNa Bot Rework Eval`, `*處理時間: ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms. 如果輸入/輸出字串長度大於1024, 只會顯示1024個字元*`);
                                    Evaled.addField('輸入', `\`\`\`py\n${toEval.substr(0, (1024 - 10))}\`\`\``);
                                    Evaled.addField('輸出', `\`\`\`py\n${evaluated.substr(0, (1024 - 10))}\`\`\``);
                                    try{
                                        this.main.util.SDM(message.channel, Evaled, message.author);
                                    }catch(e){}
                                });
                                python.stderr.on('data', (data) => {
                                    let errMSG = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 哎呀, 出錯啦! *如果輸入/輸出字串長度大於1024, 只會顯示1024個字元*`);
                                    errMSG.addField('輸入', `\`\`\`py\n${toEval.substr(0, (1024 - 10))}\n\`\`\``);
                                    errMSG.addField("eval 錯誤", `${data.toString().substr(0, (1024 - 10))}`);
                                    try{
                                        this.main.util.SDM(message.channel, errMSG, message.author);
                                    }catch(e){}
                                });
                            })
                            request(url, {}, (err, req, body) =>{
                                toEval = body;
                            }).pipe(wStream);
                        }else{
                            let errMSG = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 哎呀, 出錯啦 我需要*.py檔案! *如果輸入/輸出字串長度大於1024, 只會顯示1024個字元*`);
                            try{
                                this.main.util.SDM(message.channel, errMSG, message.author);
                            }catch(e){}
                        }
                    }
                }
            }catch(e){
                let errMSG = this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 哎呀, 出錯啦! *如果輸入/輸出字串長度大於1024, 只會顯示1024個字元*`);
                errMSG.addField('輸入', `\`\`\`js\n${toEval.substr(0, (1024 - 10))}\n\`\`\``);
                errMSG.addField("eval 錯誤", `${e.message.substr(0, (1024 - 10))}`);
                try{
                    this.main.util.SDM(message.channel, errMSG, message.author);
                }catch(e){}
            }
        }else{
            let noPerm = this.main.util.createEmbed(message.author, null, `${message.author}, 你的權限不足! 無法執行運算!`);
            try{
                this.main.util.SDM(message.channel, noPerm, message.author);
            }catch(e){}
        }

        // message.delete().catch(); //delete message at the end; 
    }
}