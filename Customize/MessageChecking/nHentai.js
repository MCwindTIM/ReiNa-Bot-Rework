const request = require('request');
const nHentaiAPI = require('nhentai-js');

let fetch_tranMap;

module.exports.run = async (ReiNa, message) =>{
    let messageArray = message.content.split(" ");
    if(message.content.startsWith("[") && message.content.endsWith("]")){
        message.delete();
        let doujinid = messageArray[0].toString().replace("[", "").replace("]", "");
        
        // reply with notice about api not work anymore
        let apiNotworkAnymore = ReiNa.util.createEmbed(message.author, `車牌連結:${doujinid}`, `${message.author} 😭由於nhentai使用了cloudflare的保護\n請親自點擊上方藍色連結訪問網站\n\n我再也不能從伺服器提取關於 **${doujinid}** 的資料`, `https://nhentai.net/g/${doujinid}/`, 0xcc0000);
            try{
                ReiNa.util.SDM(message.channel, apiNotworkAnymore, message.author);
            }catch(e){}

        // FIXME: this api not work anymore as nhentai enable cloudflare protection from scripting/botting
        // if(nHentaiAPI.exists(doujinid)){
        //     let doujin = await nHentaiAPI.getDoujin(doujinid);
        //     var napitagString = "| ";
        //     var napiartistString = "| ";
        //     var napicharacterString = "| ";
        //     var napiparodyString = "| ";
        //     var napicategoryString = "| ";
        //     var napigroupString = "| ";
        //     var napilanguageString = "| ";
        //     if(doujin.details.parodies){
        //         for(let i = 0; i < doujin.details.parodies.length; i++){
        //             napiparodyString += " | " + doujin.details.parodies[i]
        //         }
        //     }
        //     if(doujin.details.tags){
        //         for(let i = 0; i < doujin.details.tags.length; i++){
        //             napitagString += " | " + doujin.details.tags[i]
        //         }
        //     }
        //     if(doujin.details.artists){
        //         for(let i = 0; i < doujin.details.artists.length; i++){
        //             napiartistString += " | " + doujin.details.artists[i]
        //         }
        //     }
        //     if(doujin.details.languages){
        //         for(let i = 0; i < doujin.details.languages.length; i++){
        //             napilanguageString += " | " + doujin.details.languages[i]
        //         }
        //     }
        //     if(doujin.details.groups){
        //         for(let i = 0; i < doujin.details.groups.length; i++){
        //             napigroupString += " | " + doujin.details.groups[i]
        //         }
        //     }
        //     if(doujin.details.categories){
        //         for(let i = 0; i < doujin.details.categories.length; i++){
        //             napicategoryString += " | " + doujin.details.categories[i]
        //         }
        //     }
        //     if(doujin.details.characters){
        //         for(let i = 0; i < doujin.details.characters.length; i++){
        //             napicharacterString += " | " + doujin.details.characters[i]
        //         }
        //     }

        //     request.get(`http://localhost/wp-content/uploads/drive/ReiNa-Bot-Rework/translate.json`, {}, async (error, request, body) => {
        //         if(request.statusCode != 200) {
        //             //if tran server down / error
        //             //Send result without tag translate
        //             let doujinEmbed = ReiNa.util.createEmbed(message.author, `點我進入新世界!!!`, `${message.author}, 你要求查詢的資料找到了!`, `${doujin.link}`, 0xcc0000, null);
        //             doujinEmbed
        //             .setThumbnail(doujin.pages[0])
        //             .addField(doujin.title, "(･ω<)☆")
        //             .addField("原作: ", napiparodyString)
        //             .addField("角色: ", napicharacterString)
        //             .addField("標籤: ", napitagString)
        //             .addField("作者: ", napiartistString)
        //             .addField("團隊: ", napigroupString)
        //             .addField("語言: ", napilanguageString)
        //             .addField("分類: ", napicategoryString)
        //             .addField("頁數: ", doujin.pages.length);
        //             try {
        //                 ReiNa.util.SDM(message.channel, doujinEmbed, message.author);
        //             }   catch (e) {}
        //             return;
        //         }
        //         fetch_tranMap = await JSON.parse(body);

        //         napicategoryString = await replaceAll(napicategoryString, fetch_tranMap.tranMap_Cate);
        //         napicharacterString = await replaceAll(napicharacterString, fetch_tranMap.tranMap_Char);
        //         napilanguageString = await replaceAll(napilanguageString, fetch_tranMap.tranMap_Lang);
        //         napiparodyString = await replaceAll(napiparodyString, fetch_tranMap.tranMap_Parody);
        //         napitagString = await replaceAll(napitagString, fetch_tranMap.tranMap_Tag);

        //         let doujinEmbed = ReiNa.util.createEmbed(message.author, `點我進入新世界!!!`, `${message.author}, 你要求查詢的資料找到了!`, `${doujin.link}`, 0xcc0000, null);
        //         doujinEmbed
        //         .setThumbnail(doujin.pages[0])
        //         .addField(doujin.title, "(･ω<)☆")
        //         .addField("原作: ", napiparodyString)
        //         .addField("角色: ", napicharacterString)
        //         .addField("標籤: ", napitagString)
        //         .addField("作者: ", napiartistString)
        //         .addField("團隊: ", napigroupString)
        //         .addField("語言: ", napilanguageString)
        //         .addField("分類: ", napicategoryString)
        //         .addField("頁數: ", doujin.pages.length);
        //         try {
        //             ReiNa.util.SDM(message.channel, doujinEmbed, message.author);
        //         }   catch (e) {
        //         }

        //     });
        // }else{
        //     let notFound = ReiNa.util.createEmbed(message.author, `ReiNa Bot Rework 錯誤`, `${message.author} 😭這塊車牌我找不到資料\n\n車牌號碼: **${doujinid}**`, `https://nhentai.net/`, 0xcc0000);
        //     try{
        //         ReiNa.util.SDM(message.channel, notFound, message.author);
        //     }catch(e){}
        // }
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