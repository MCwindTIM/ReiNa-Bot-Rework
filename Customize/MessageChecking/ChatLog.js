const fs = require('fs');
const fsPath = require('fs-path');

module.exports.log = (file, message) => {
    let log_date_ob = new Date();
    let log_date = ("0" + log_date_ob.getDate()).slice(-2);
    let log_year = log_date_ob.getFullYear();
    let log_month = ("0" + (log_date_ob.getMonth() + 1)).slice(-2);
    let log_minutes = log_date_ob.getMinutes();
    let log_seconds = log_date_ob.getSeconds();
    let log_hours = log_date_ob.getHours();
    let tStamp = log_year + "-" + log_month + "-" + log_date + " " + log_hours + ":" + log_minutes + ":" + log_seconds;

    try{
        fs.readFile(file, {encoding: 'utf-8'}, function(err,data){
            if (!err){
            fsPath.writeFile(file, data + `-----發送信息-----------\n用戶名稱: ${message.author.tag}\n用戶ID: ${message.author.id}\n信息內容: ${message.content}\n記錄時間: ${tStamp}\n--------------------\n|\n`, function(err){
            if(err){throw err;}});
            }else{
            fsPath.writeFile(file, `-----發送信息-----------\n用戶名稱: ${message.author.tag}\n用戶ID: ${message.author.id}\n信息內容: ${message.content}\n記錄時間: ${tStamp}\n--------------------\n|\n`, function(err){
            if(err){throw err;}});
            }
        });

    }
    catch(e){}
}