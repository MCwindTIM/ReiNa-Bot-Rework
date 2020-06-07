const Command = require('../../Core/command');

module.exports = class IPv6Command extends Command {
    constructor(main){
        super(main, {
            name: "ipv6",
            category: "功能性",
            help: "Compress/expand IPv6 Address",
            args: [{
                name: '',
                desc: ''
            },
            {
                name: '',
                desc: ''
            }],
            caseSensitive: true
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        if(args.length < 2){
            let NEA = await this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author}, 參數不足 請使用**${this.main.config.prefix}help ${this.name}**獲得幫助!`);
            try{
                await this.main.util.SDM(message.channel, NEA, message.author);
            }catch(e){}
            return;
        }
        if(args[0] === 'expand'){
            let ip = expandIPv6Address(args[1]);
            let finexpand = this.main.util.createEmbed(message.author, `ReiNa Bot Rework IPv6 Expand`, `${message.author}, 我運算好啦!~`);
            finexpand.addField('模式', '拓展')
            .addField('提供的IPv6地址', `${args[1]}`)
            .addField('結果', `${ip}`);
            try{
                await this.main.util.SDM(message.channel, finexpand, message.author);
            }catch(e){}
        } else {
            if(args[0] === 'compress'){
                //compress ip
                let ip = compIPV6(args[1]);
                let fincompress = await this.main.util.createEmbed(message.author, `ReiNa Bot Rework IPv6 Compress`, `${message.author}, 我運算好啦!~`);
                fincompress.addField('模式', '壓縮')
                .addField('提供的IPv6地址', `${args[1]}`)
                .addField('結果', `${ip}`);
                try{
                    await this.main.util.SDM(message.channel, fincompress, message.author);
                }catch(e){}
            }else{
                //wrong arg
                let WA = await this.main.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author}, 參數錯誤 請使用**${this.main.config.prefix}help ${this.name}**獲得幫助!`);
                try{
                    await this.main.util.SDM(message.channel, WA, message.author);
                }catch(e){}
                return;
            }
        }

    }
}

function compIPV6(input) {
    return input.replace(/\b(?:0+:){2,}/, ':');
}

function expandIPv6Address(address) {
    var fullAddress = "";
    var expandedAddress = "";
    var validGroupCount = 8;
    var validGroupSize = 4;

    var ipv4 = "";
    var extractIpv4 = /([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/;
    var validateIpv4 = /((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})/;

    if (validateIpv4.test(address)) {
        groups = address.match(extractIpv4);
        for (var i = 1; i < groups.length; i++) {
            ipv4 += ("00" + (parseInt(groups[i], 10).toString(16))).slice(-2) + (i == 2 ? ":" : "");
        }
        address = address.replace(extractIpv4, ipv4);
    }

    if (address.indexOf("::") == -1)
        fullAddress = address;
    else {
        var sides = address.split("::");
        var groupsPresent = 0;
        for (var i = 0; i < sides.length; i++) {
            groupsPresent += sides[i].split(":").length;
        }
        fullAddress += sides[0] + ":";
        for (var i = 0; i < validGroupCount - groupsPresent; i++) {
            fullAddress += "0000:";
        }
        fullAddress += sides[1];
    }
    var groups = fullAddress.split(":");
    for (var i = 0; i < validGroupCount; i++) {
        while (groups[i].length < validGroupSize) {
            groups[i] = "0" + groups[i];
        }
        expandedAddress += (i != validGroupCount - 1) ? groups[i] + ":" : groups[i];
    }
    return expandedAddress;
}