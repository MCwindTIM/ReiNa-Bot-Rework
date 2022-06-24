const request = require("request");
module.exports.UpdateChannel = async (ReiNa) => {
    const ethUrl =
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
    const btcUrl =
        "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD";
    request(ethUrl, {}, async (error, res, body) => {
        try {
            if (error || res.statusCode != 200) return;
            let obj = await JSON.parse(body);
            if (obj.USD === undefined) return;
            //set channel name to result object
            await ReiNa.bot.channels.cache
                .get("670914685352280064")
                .setName(`ETH:${obj.USD}💸`);
        } catch (err) {
            return;
        }
    });
    request(btcUrl, {}, async (error, res, body) => {
        try {
            if (error || res.statusCode != 200) return;
            let obj = await JSON.parse(body);
            if (obj.USD === undefined) return;
            //set channel name to result object
            await ReiNa.bot.channels.cache
                .get("989642254715080824")
                .setName(`BTC:${obj.USD}💸`);
        } catch (err) {
            return;
        }
    });
};
