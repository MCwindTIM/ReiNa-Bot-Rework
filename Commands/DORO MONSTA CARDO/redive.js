const Command = require('../../Core/command');
const Canvas = require('canvas');
const snek = require('node-fetch');
const Discord = require('discord.js');

module.exports = class rediveCommand extends Command {
    constructor(main){
        super(main, {
            name: "redive",
            category: "DORO MONSTA CARDO",
            help: "模擬抽卡 (公主連結 Re : Dive)",
            args: [{
                name: "[可選填]單抽",
                desc: "選擇要不要單抽, 如果該值為空 將視為10連抽"
            }]
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
        if(args[0] === `單抽`){
            snek(`http://localhost/nobuDB-master/ReDive.json`).then(async (r) => {
                var r = await r.json();
                //創建圖片 96x96
                const canvas = Canvas.createCanvas(96, 96);
                const ctx = canvas.getContext('2d');
                await roll1(ctx, r, [0, 0]).then(async(result) => {
                    let attachment = new Discord.MessageAttachment(canvas.toBuffer(), `result.png`);
                    await message.channel.send(`${message.author}` + `卡池幾率【3★ 2.5%】 【2★ 18%】 【1★ 79.5%】:\`\`\`\n${result}\`\`\``, attachment);
                });
            })
        }else{
            snek(`http://localhost/nobuDB-master/ReDive.json`).then(async (r) => {
                var r = await r.json();
				const canvas = Canvas.createCanvas(480, 192);
                const ctx = canvas.getContext('2d');
				await roll10(ctx, r).then(async (results) => {
                    results = results.slice(0, 5).join(' | ') + "\n" + results.slice(5).join(' | ');
                    let attachment = new Discord.MessageAttachment(canvas.toBuffer(), `result.png`);
					await message.channel.send(`${message.author}` + `卡池幾率【3★ 2.5%】 【2★ 18%】 【1★ 79.5%】:\`\`\`\n${results}\`\`\``, attachment);
				});
			});
        }
    }
}

function getCard(data, rate) {
    let dice = Math.random() * 100;
    let item = "";
    if (dice <= rate["c3"])      item = 'ReDive/'  + ARand(data.character["3"]); 
    else if (dice <= rate["c2"]) item = 'ReDive/'  + ARand(data.character["2"]);
    else if (dice <= rate["c1"]) item = 'ReDive/'  + ARand(data.character["1"]);
    return item;
}

function ARand(array) {
    if (array.length == 1) return array[0];
    return array[rand(0, array.length - 1)];
}

function roll1 (ctx, data, pos, rate) {
    return new Promise((resolve, reject) => {
	  let Rest = {c3: 2.5, c2: 18, c1: 100};
      rate = rate || Rest;
      let card = new Canvas.Image();
      let item = getCard(data, rate);
      snek(`http://localhost/nobuDB-master/images/${item}.png`).then(async (r) => {
        card.onerror = reject;
        card.onload = () => {
          ctx.drawImage(card, ...pos);
          if (item.length == 5) item += " ";
          resolve(item);
        }
        card.src = await r.buffer();
      });
    });
}

function rand(min, max) {
    max = max || 1;
    min = min || 0;
    if (max < min) return false;
	return Math.round((Math.random() * (max - min)) + min);
}

function roll10 (ctx, data) {
  const GRS = {c3: 2.5, c2: 60, c1: 100};
  const GS = {c3: 2.5, c2: 18, c1: 100};
    let results = Array(10).fill('');
    results = results.map((item, index) => {
      if (index < 5) index = [index * 96, 0];
      else index = [(index - 5) * 96, 96];
      if (index == 0) return roll1(ctx, data, index, GRS);
      if (index == 1) return roll1(ctx, data, index, GS);
      return roll1(ctx, data, index);
    });
	return Promise.all(results);
}