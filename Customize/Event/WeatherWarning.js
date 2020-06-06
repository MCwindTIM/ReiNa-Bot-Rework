const request = require('request');

module.exports.CheckWeatherWarning = async (ReiNa) => {
request(`https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc`, {}, 
    async (error, response, body) => {
        if(error && response.statusCode != 200) return;
        let obj = await JSON.parse(body);
        if(obj.warningMessage === '' || obj.warningMessage === ReiNa.WeatherWarningMSG) return;
        ReiNa.event.emit('WWarning', obj.warningMessage);
    });
}