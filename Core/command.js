module.exports = class Command {
    constructor(main, data){
        this.main = main;
        this.name = data.name;
        this.category = data.category || "未分類";
        this.alias = data.alias || [];
        this.args = data.args || [];
        this.devOnly = data.devOnly || false;
        this.desc = data.help || '未有幫助信息';
        if(data.nsfw) this.desc += `\n\n此指令僅限啟用NFSW的頻道`;
        this.help = `${this.main.config.prefix}${this.name} ${this.args.map(item => {return `<${item.name}>`;}).join(data.argsSep || ' ')}`;
        if(this.args.length) this.help += `\n\n${this.args.map(item => {return `**__${item.name}__**: ${item.desc}`}).join('\n\n')}`;
        this.help = {
            title: `指令 ${this.name} 的信息`,
            description: '詳細信息',
            fields: [
                {
                    name: "類別",
                    value: this.category
                },
                {
                    name: "指令格式",
                    value: this.help
                },
                {
                    name: "別名",
                    value: this.alias.join(' | ') || "沒有別名"
                },
                {
                    name: "說明",
                    value: this.desc
                }
            ]
        }
        this.timeUsed = 0;
        this.caseSensitive = data.caseSensitive || false;
        this.cleanContent = data.cleanContent || false;
    }
}