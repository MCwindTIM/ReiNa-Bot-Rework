const Command = require('../../Core/command');
const Canvas = require('canvas');
const snek = require('node-fetch');
const Discord = require('discord.js');

module.exports = class GachaCommand extends Command {
    constructor(main){
        super(main, {
            name: "gacha",
            category: "DORO MONSTA CARDO",
            help: "模擬抽卡 (Fate / Grand Order)",
            args: [{
                name: "[可選填]單抽",
                desc: "選擇要不要單抽, 如果該值為空 將視為10連抽"
            }]
        });
    }
    async run(message, args, prefix){
        message.delete().catch();
		if(args[0] === "單抽"){
            snek(`http://localhost/nobuDB-master/gatcha.json`).then(async r => {
                var r = await r.json();
                  const canvas = Canvas.createCanvas(129, 222);
                  const ctx = canvas.getContext('2d');
                  await roll1(ctx, r, [0, 0]).then(async(result) => {
                    let attachment = new Discord.MessageAttachment(canvas.toBuffer(), `result.png`);
                    await message.channel.send(`${message.author}` + `卡池大規模更新中，所有英靈都加入卡池列表，禮裝待更新:\`\`\`\n${result}\`\`\``, attachment);
                  });
              });
            }else{
                snek(`http://localhost/nobuDB-master/gatcha.json`).then(async r => {
                    var r = await r.json();
                    const canvas = Canvas.createCanvas(645, 444);
                    const ctx = canvas.getContext('2d');
                    await roll10(ctx, r).then(async(results) => {
                        results = results.slice(0, 5).join(' | ') + "\n" + results.slice(5).join(' | ');
                        let attachment = new Discord.MessageAttachment(canvas.toBuffer(), `result.png`);
                        await message.channel.send(`${message.author}` + `卡池大規模更新中，所有英靈都加入卡池列表，禮裝待更新:\`\`\`\n${results}\`\`\``, attachment);
                    });
                });
            }
    }
}

function getCard(data, rate) {
    let dice = Math.random() * 100;
    let item = "";
    if (dice <= rate["s5"])      item = 'S/'  + ARand(data.servants["5"]); 
    else if (dice <= rate["s4"]) item = 'S/'  + ARand(data.servants["4"]);
    else if (dice <= rate["s3"]) item = 'S/'  + ARand(data.servants["3"]);
    else if (dice <= rate["c5"]) item = 'CE/' + ARand(data.ce["5"]);
    else if (dice <= rate["c4"]) item = 'CE/' + ARand(data.ce["4"]);
    else if (dice <= rate["c3"]) item = 'CE/' + ARand(data.ce["3"]);
    return item;
}

function ARand(array) {
    if (array.length == 1) return array[0];
    return array[rand(0, array.length - 1)];
}

function roll1 (ctx, data, pos, rate) {
    return new Promise((resolve, reject) => {
	  let Rest = {s5: 1, s4: 4, s3: 20, c5: 24, c4: 36, c3: 100};
      rate = rate || Rest;
      let card = new Canvas.Image();
      let item = getCard(data, rate);
      snek(`http://localhost/nobuDB-master/images/${item}.png`).then(async r => {
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
	const GSR = {s5: 1, s4: 20, c5: 24, c4: 100};
	const GS = {s5: 1, s4: 4, s3: 100};
    let results = Array(10).fill('');
    results = results.map((item, index) => {
      if (index < 5) index = [index * 129, 0];
      else index = [(index - 5) * 129, 222];
      if (index == 0) return roll1(ctx, data, index, GSR);
      if (index == 1) return roll1(ctx, data, index, GS);
      return roll1(ctx, data, index);
    });
	return Promise.all(results);
}