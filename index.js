'use strict';
let https = require('https');
var gardenconfig = require("config.json");
exports.handler = function(event, context, callback) {

var temperaturereturn = function() {
return new Promise((resolve, reject) => {
    console.log('Starting Temperature...');
        https.get(gardenconfig.Temperature.APIURL, (response) => {
        response.on('data', (d) => {
            var parsed = JSON.parse(d);
            var t = parsed.field1.substring(0, parsed.field1.length-3);
            let response = gardenconfig.Temperature.Prefix + t + gardenconfig.Temperature.Suffix;
            console.log(response);
           resolve(response);
        });
        });    
}).then(function(data){
    return data
});
};

var humidityreturn = function() {
return new Promise((resolve, reject) => {
    console.log('Starting Humidity...');
        https.get("https://api.thingspeak.com/channels/298464/fields/2/last.json", (response) => {
        response.on('data', (d) => {
            var parsed = JSON.parse(d);
            //console.log(parsed);
            var t = parsed.field2.substring(0, parsed.field2.length-3);
            let response = "the humidity is " + t + " percent";
            console.log(response);
            resolve(response);
        });
        });    
    }).then(function(data){
        return data
    });
    };

    console.log("Starting Query");
    console.log( "Intent:" + event.result.metadata.intentName + " received");
    
    if(event.result.metadata.intentName == "Temperature") {
        Promise.all([temperaturereturn()]).then(function (data){
            callback(null, {"speech": data[0]});
        });
        
    } 
            

    else if (event.result.metadata.intentName == "Humidity") {
       Promise.all([humidityreturn()]).then(function (data){
            callback(null, {"speech": data[0]});
        });
    }
    else if (event.result.metadata.intentName == "Temperature and Humidity") {
        Promise.all([temperaturereturn(), humidityreturn()]).then(function (data){
            callback(null, {"speech": data[0] + " and " + data[1]});
        });    
    }
    
    
    else {
        console.log('Unknown Request received');
        callback(null, {"speech": "Unknown Request"});
    }
};