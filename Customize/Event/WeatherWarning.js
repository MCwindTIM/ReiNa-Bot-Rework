const request = require('request');

module.exports.CheckWeatherWarning = async (ReiNa) => {
request(`https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc`, {}, 
    async (error, response, body) => {
        if(error && response.statusCode != 200) return;
        let obj = await JSON.parse(body);
        if(obj.warningMessage.length === 0 || obj.warningMessage.equals(ReiNa.WeatherWarningMSG)) return;
		    ReiNa.event.emit('WWarning', obj.warningMessage);
            ReiNa.WeatherWarningMSG = obj.warningMessage;
    });
}

Array.prototype.equals = function (array) {
    if (!array)
        return false;

    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            return false;   
        }           
    }       
    return true;
}
Object.defineProperty(Array.prototype, "equals", {enumerable: false});