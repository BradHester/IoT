'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const restService = express();


restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

//    http.get("http://api.thingspeak.com/channels/298464/fields/1/last.json", (res) => {
//    // Received data is a buffer.
//    // Adding it to our body
//     res.on('data', (d) => {
//        //process.stdout.write(d);
//        var parsed = JSON.parse(d)
//        var t = parsed.field1.substring(0, parsed.field1.length-3);
//        var z = t.toString();
//        console.log(z);
//        });
//
//     })



//var ThingSpeakClient = require('thingspeakclient');
//	var client = new ThingSpeakClient();

//    client.getLastEntryInFieldFeed(298464, 1, function(err2, response) {
//    if (err2 == null) {
//        var t = response.field1.substring(0, response.field1.length-3);
//        console.log('read successfully. value is: ' + response.field1);
//        console.log('Converted to: ' + t);
//      });

restService.post('/echo', function(req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
	var ThingSpeakClient = require('thingspeakclient');
	var client = new ThingSpeakClient();

	//client.attachChannel(298464, { readKey:'A1FE5T3THYNCRH05'});
    var t = '18';
    //client.getLastEntryInFieldFeed(298464, 1, t);

    //client.getLastEntryInFieldFeed(298464, 1); //same as API-Method "Retrieving the Last Entry in a Field Feed"

	return res.json({
        speech: 'The temperature is ' + t + ' degrees',
        displayText: 'The temperature is ' + t + ' degrees',
        source: 'Brad Auto Respond'
    });
    //return res.json({
    //   speech: speech,
    //    displayText: speech,
    //    source: 'webhook-echo-sample'
    //});
});

restService.post('/temperature', function(req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
    var t = 'Error has occurred';
    const req = http.get("http://api.thingspeak.com/channels/298464/fields/1/last.json", (res) => {
    // Received data is a buffer.
    // Adding it to our body
     res.on('data', (d) => {
        //process.stdout.write(d);
        var parsed = JSON.parse(d)
        console.log(parsed);
        t = parsed.field1.substring(0, parsed.field1.length-3);
        });

     })
    req.on('error',(e) => {
        t = e;
    });

	return res.json({
        speech: 'The temperature is ' + t + ' degrees',
        displayText: 'The temperature is '  + t + ' degrees',
        source: 'Brad Auto Respond'
    });

});


restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
