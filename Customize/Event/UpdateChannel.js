const request = require("request");
module.exports.UpdateChannel = async (ReiNa) => {
    const apiUrl =
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=HKD";
    //request eth to hkd json object from apiUrl
    request(apiUrl, {}, async (error, res, body) => {
        try {
            if (error || res.statusCode != 200) return;
            let obj = await JSON.parse(body);
            if (obj.HKD === undefined) return;
            //set channel name to result object
            await ReiNa.bot.channels.cache
                .get("670914685352280064")
                .setName(`ETH→HKD:${obj.HKD}💸`);
        } catch (err) {
            return;
        }
    });
};
