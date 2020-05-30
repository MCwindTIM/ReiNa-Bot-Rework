const request = require('request');
const nHentaiAPI = require('nhentai-api-js');

let napi = new nHentaiAPI();

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
            napilanguageString = napilanguageString.replace("japanese", "日語");
            napilanguageString = napilanguageString.replace("chinese", "漢語");
            napilanguageString = napilanguageString.replace("english", "英語");
            napilanguageString = napilanguageString.replace("translated", "翻譯");
            
            napicategoryString = napicategoryString.replace("doujinshi", "同人本");
            napicategoryString = napicategoryString.replace("manga", "漫畫");
            
            napitagString = napitagString.replace("full color", "全彩");
            napitagString = napitagString.replace("twintails", "雙馬尾");
            napitagString = napitagString.replace("lolicon", "蘿莉控");
            napitagString = napitagString.replace("stockings", "長筒襪");
            napitagString = napitagString.replace("sole female", "單女主");
            napitagString = napitagString.replace("schoolgirl uniform", "校服");
            napitagString = napitagString.replace("sole male", "單男主");
            napitagString = napitagString.replace("nakadashi", "中出");
            napitagString = napitagString.replace("x-ray", "透視");
            napitagString = napitagString.replace("shimapan", "藍白胖次");
            napitagString = napitagString.replace("table masturbation", "桌角自慰");
            napitagString = napitagString.replace("kemonomimi", "獸耳");
            napitagString = napitagString.replace("fox girl", "狐娘");
            napitagString = napitagString.replace("collar", "項圈");
            napitagString = napitagString.replace("tail", "尾巴");
            napitagString = napitagString.replace("bunny girl", "兔女郎");
            napitagString = napitagString.replace("waitress", "女服務員");
            napitagString = napitagString.replace("handjob", "打手槍");
            napitagString = napitagString.replace("gymshorts", "拳擊短褲");
            napitagString = napitagString.replace("prostate massage", "前列腺按摩");
            napitagString = napitagString.replace("anal", "肛門");
            napitagString = napitagString.replace("bondage", "束縛");
            napitagString = napitagString.replace("females only", "只有女性");
            napitagString = napitagString.replace("males only", "只有男性");
            napitagString = napitagString.replace("yaoi", "男同");
            napitagString = napitagString.replace("shotacon", "正太控");
            napitagString = napitagString.replace("blowjob face", "口交臉");
            napitagString = napitagString.replace("blowjob", "口交");
            napitagString = napitagString.replace("rape", "強姦");
            napitagString = napitagString.replace("double penetration", "雙重插入");
            napitagString = napitagString.replace("group", "群交");
            napitagString = napitagString.replace("mmf threesome", "兩男一女");
            napitagString = napitagString.replace("bloomers", "運動短褲");
            napitagString = napitagString.replace("mosaic censorship", "馬賽克遮擋");
            napitagString = napitagString.replace("age regression", "返老還童");
            napitagString = napitagString.replace("amputee", "人棍");
            napitagString = napitagString.replace("body modification", "身體改造");
            napitagString = napitagString.replace("prolapse", "脫垂");
            napitagString = napitagString.replace("birth", "出產");
            napitagString = napitagString.replace("pregnant", "孕婦");
            napitagString = napitagString.replace("magical girl", "魔法少女");
            napitagString = napitagString.replace("asphyxiation", "窒息");
            napitagString = napitagString.replace("dark skin", "黑肉");
            napitagString = napitagString.replace("mind control", "精神控制");
            napitagString = napitagString.replace("multi-work series", "系列作品");
            napitagString = napitagString.replace("lactation", "乳汁");
            napitagString = napitagString.replace("bride", "新娘");
            napitagString = napitagString.replace("dilf", "熟男");
            napitagString = napitagString.replace("impregnation", "内射");
            napitagString = napitagString.replace("bbm", "胖男人");
            napitagString = napitagString.replace("piss drinking", "喝尿");
            napitagString = napitagString.replace("futanari", "扶她");
            napitagString = napitagString.replace("sole dickgirl", "單扶她");
            napitagString = napitagString.replace("gloves", "手套")
            napitagString = napitagString.replace("tankoubon", "單行本");
            napitagString = napitagString.replace("guro", "獵奇");
            napitagString = napitagString.replace("unusual pupils", "異瞳");
            napitagString = napitagString.replace("slave", "奴隸");
            napitagString = napitagString.replace("sex toys", "性玩具");
            napitagString = napitagString.replace("mind break", "洗腦");
            napitagString = napitagString.replace("drugs", "藥物");
            napitagString = napitagString.replace("ahegao", "阿黑颜");
            napitagString = napitagString.replace("glasses", "眼鏡");
            napitagString = napitagString.replace("big breasts", "巨乳");
            napitagString = napitagString.replace("tomgirl", "假冒女孩");
            napitagString = napitagString.replace("dickgirl on male", "扶上男");
            napitagString = napitagString.replace("male on dickgirl", "男上扶");
            napitagString = napitagString.replace("gokkun", "飲精");
            napitagString = napitagString.replace("bukkake", "精液覆蓋");
            napitagString = napitagString.replace("doujinshi", "同人本");
            napitagString = napitagString.replace("zombie", "殭屍");
            napitagString = napitagString.replace("yuri", "百合");
            napitagString = napitagString.replace("scat", "排便");
            napitagString = napitagString.replace("vomit", "嘔吐");
            napitagString = napitagString.replace("full censorship", "完全修正");
            napitagString = napitagString.replace("dog", "狗");
            napitagString = napitagString.replace("bestiality", "獸交");
            napitagString = napitagString.replace("tanlines", "曬痕");
            napitagString = napitagString.replace("deepthroat", "深喉");
            napitagString = napitagString.replace("swimsuit", "泳衣");
            
            
            
            
            
            
            napiparodyString = napiparodyString.replace("kantai collection", "艦隊收藏");
            napiparodyString = napiparodyString.replace("touhou project", "東方");
            napiparodyString = napiparodyString.replace("fate grand order", "Fate/Grand Order");
            napiparodyString = napiparodyString.replace("gochuumon wa usagi desu ka | is the order a rabbit", "請問您今天要來點兔子嗎?");
            napiparodyString = napiparodyString.replace("gochuumon wa usagi desu ka", "請問您今天要來點兔子嗎?");
            napiparodyString = napiparodyString.replace("aldnoah.zero", "ALDNOAH.ZERO");
            napiparodyString = napiparodyString.replace("puella magi madoka magica", "魔法少女小圓");
            napiparodyString = napiparodyString.replace("fate kaleid liner prisma illya", "Fate/kaleid liner 魔法少女☆伊莉雅");
            napiparodyString = napiparodyString.replace("hataraku saibou", "工作細胞");
            napiparodyString = napiparodyString.replace("zombie land saga", "佐賀偶像是傳奇");
            napiparodyString = napiparodyString.replace("original", "原創");
            
            
            napicharacterString = napicharacterString.replace("teitoku", "提督");
            napicharacterString = napicharacterString.replace("hibiki", "嚮");
            napicharacterString = napicharacterString.replace("gudao", "咕噠/藤丸立香");
            napicharacterString = napicharacterString.replace("tamamo cat", "玉藻喵");
            napicharacterString = napicharacterString.replace("sharo kirima", "桐間紗路");
            napicharacterString = napicharacterString.replace("inaho kaizuka", "界塚伊奈帆");
            napicharacterString = napicharacterString.replace("slaine troyard", "斯雷因・特洛耶特");
            napicharacterString = napicharacterString.replace("homura akemi", "曉美焰");
            napicharacterString = napicharacterString.replace("madoka kaname", "鹿目圓");
            napicharacterString = napicharacterString.replace("asashio", "朝潮");
            napicharacterString = napicharacterString.replace("jeanne alter lily", "貞德·Alter·Santa·Lily");
            napicharacterString = napicharacterString.replace("jeanne alter", "黑貞德");
            napicharacterString = napicharacterString.replace("jeanne darc", "貞德");
            napicharacterString = napicharacterString.replace("miyu edelfelt", "美遊");
            napicharacterString = napicharacterString.replace("illyasviel von einzbern", "伊莉雅絲菲爾・馮・愛因茲貝倫");
            napicharacterString = napicharacterString.replace("chloe von einzbern", "克洛伊・馮・愛因茲貝倫");
            napicharacterString = napicharacterString.replace("platelet", "血小板");
            napicharacterString = napicharacterString.replace("shikieiki yamaxanadu", "四季映姫");
            napicharacterString = napicharacterString.replace("junko konno", "紺野純子");
            napicharacterString = napicharacterString.replace("ai mizuno", "水野愛");
            napicharacterString = napicharacterString.replace("carmilla", "卡蜜拉");
            
            
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

module.exports.name = "nHentai車牌號";