const request = require('request');
const nHentaiAPI = require('nhentai-api-js');

let napi = new nHentaiAPI();
let fetch_tranMap;

module.exports.run = async (ReiNa, message) =>{
    let messageArray = message.content.split(" ");
    if(message.content.startsWith("[") && message.content.endsWith("]")){
        message.delete();
        let doujinid = messageArray[0].toString().replace("[", "").replace("]", "");
        napi.g(doujinid).then(gallery =>{
            var i;
            var napitagString = "| ";
            var napiartistString = "| ";
            var napicharacterString = "| ";
            var napiparodyString = "| ";
            var napicategoryString = "| ";
            var napigroupString = "| ";
            var napilanguageString = "| ";
            for(i = 0; i < gallery.tags.length; i++){
                if(gallery.tags[i].type === "tag"){
                    napitagString += " | " + gallery.tags[i].name
                }
                if(gallery.tags[i].type === "artist"){
                    napiartistString += " | " + gallery.tags[i].name
                }
                if(gallery.tags[i].type === "language"){
                    napilanguageString += " | " + gallery.tags[i].name
                }
                if(gallery.tags[i].type === "group"){
                    napigroupString += " | " + gallery.tags[i].name
                }
                if(gallery.tags[i].type === "category"){
                    napicategoryString += " | " + gallery.tags[i].name
                }
                if(gallery.tags[i].type === "parody"){
                    napiparodyString += " | " + gallery.tags[i].name
                }
                if(gallery.tags[i].type === "character"){
                    napicharacterString += " | " + gallery.tags[i].name
                }
            }
            request.get(`https://duckduckdoc.tk/wp-content/uploads/drive/ReiNa-Bot-Rework/translate.json`, {}, async (error, request, body) => {
                if(request.statusCode != 200) return;
                fetch_tranMap = await JSON.parse(body);

                napicategoryString = await replaceAll(napicategoryString, fetch_tranMap.tranMap_Cate);
                napicharacterString = await replaceAll(napicharacterString, fetch_tranMap.tranMap_Char);
                napilanguageString = await replaceAll(napilanguageString, fetch_tranMap.tranMap_Lang);
                napiparodyString = await replaceAll(napiparodyString, fetch_tranMap.tranMap_Parody);
                napitagString = await replaceAll(napitagString, fetch_tranMap.tranMap_Tag);

            });


            request.get("https://i.nhentai.net/galleries/" + gallery.media_id + "/1.png", {},
            (error, response, cover) => {
                if(response.statusCode == 404){
                    var coverlink = "https://i.nhentai.net/galleries/" + gallery.media_id + "/1.jpg";
                    let doujinEmbed = ReiNa.util.createEmbed(message.author, `點我進入新世界!!!`, `${message.author}, 你要求查詢的資料找到了!`, `https://nhentai.net/g/${gallery.id}`, 0xcc0000, null);
                    doujinEmbed
                    .setThumbnail(coverlink)
                    .addField(gallery.title.japanese, "(･ω<)☆")
                    .addField("原作: ", napiparodyString)
                    .addField("角色: ", napicharacterString)
                    .addField("標籤: ", napitagString)
                    .addField("作者: ", napiartistString)
                    .addField("團隊: ", napigroupString)
                    .addField("語言: ", napilanguageString)
                    .addField("分類: ", napicategoryString)
                    .addField("頁數: ", gallery.num_pages);
                    try {
                        ReiNa.util.SDM(message.channel, doujinEmbed, message.author);
                    }   catch (e) {}
                }
                else{
                    var coverlink = "https://i.nhentai.net/galleries/" + gallery.media_id + "/1.jpg";
                    let doujinEmbed = ReiNa.util.createEmbed(message.author, `點我進入新世界!!!`, `${message.author}, 你要求查詢的資料找到了!`, `https://nhentai.net/g/${gallery.id}`, 0xcc0000, null);
                    doujinEmbed
                    .setThumbnail(coverlink)
                    .addField(gallery.title.japanese, "(･ω<)☆")
                    .addField("原作: ", napiparodyString)
                    .addField("角色: ", napicharacterString)
                    .addField("標籤: ", napitagString)
                    .addField("作者: ", napiartistString)
                    .addField("團隊: ", napigroupString)
                    .addField("語言: ", napilanguageString)
                    .addField("分類: ", napicategoryString)
                    .addField("頁數: ", gallery.num_pages);
                    try {
                        ReiNa.util.SDM(message.channel, doujinEmbed, message.author);
                    }   catch (e) {}
                }
            });
        }).catch((e) =>{
            let notFound = ReiNa.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 😭這塊車牌我找不到資料\n\n車牌號碼: **${doujinid}**`, `https://nhentai.net/`, 0xcc0000);
            try{
                ReiNa.util.SDM(message.channel, notFound, message.author);
            }catch(e){}
        });
    }
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function replaceAll(str, map){
    for(key in map){
        str = str.replaceAll(key, map[key]);
    }
    return str;
}

module.exports.name = "nHentai車牌號";