const Command = require('../../Core/command');

module.exports = class ClearMSGCommand extends Command {
    constructor(main){
        super(main, {
            name: "clear",
            category: "管理員限定",
            help: "清除指定數目信息",
            args: [{
                name: "數目",
                desc: "1 - 100"
            }]
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        if(message.member.permissions.has('MANAGE_MESSAGES') === true){
            clear.call(this, message, args);
        }else{
            let noPerm = this.main.util.createEmbed(message.author, null, `${message.author}, 你沒有權限 **MANAGE_MESSAGES**, 所以不可以刪除信息!`)
            try{
                await this.main.util.SDM(message.channel, noPerm, message.author);
            }catch(e){}
        }
    }
}

async function clear(message, args){
	if(isNaN(args[0])){
        let NaNMSG = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 請輸入有效數目!`);
        try{
            this.main.util.SDM(message.channel, NaNMSG, message.author);
        }catch(e){}
		 return;
    }

    args[0] = Math.round(args[0]);

    if(args[0] < 2){
        args[0] + 1;
    }
    if(args[0] > 100){
        let tooMuch = this.main.util.createEmbed(message.author, null, `${message.author} Senpai, 刪除信息不能大於100哦!`)
        try{
            this.main.util.SDM(message.channel, tooMuch, message.author);
        }catch(e){}
		 return;
	}
	  
	  const fetched = await message.channel.messages.fetch({limit: args[0]});
	  
      message.channel.bulkDelete(fetched).then(() => {
	  console.log(`正在刪除 ${message.guild.name} | ${message.channel.name} (${message.channel.id}) 的 ${fetched.size} 條信息...`);
        let deleted = this.main.util.createEmbed(message.author, null, `${message.author} 刪除了*${args[0]}*條信息`)
        this.main.util.SDM(message.channel, deleted, message.author);
      }).catch(e =>{
	    console.log(`正在刪除 ${message.guild.name} | ${message.channel.name} (${message.channel.id}) 的 ${fetched.size} 條信息... (超過14天的信息無法刪除)`);
        let deleted = this.main.util.createEmbed(message.author, null, `${message.author} 嘗試刪除了*${args[0]}*條信息\n超過14天的信息無法刪除!`)
        this.main.util.SDM(message.channel, deleted, message.author);
      });
}