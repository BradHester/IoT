'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();


restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

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
	var ThingSpeakClient = require('thingspeakclient');
	var client = new ThingSpeakClient();
    var https = require('https');


    https.get("https://api.thingspeak.com/channels/298464/fields/1/last.json", function(res) {
        var body = ''; // Will contain the final response
    // Received data is a buffer.
    // Adding it to our body
    res.on('data', function(data){
        body += data;
    });
    // After the response is completed, parse it and log it to the console
    res.on('end', function() {
        var parsed = JSON.parse(body);
         console.log(parsed);
        });
     })
        // If any error has occured, log error to console
        .on('error', function(e) {
        console.log("Got error: " + e.message);
        });
	    //client.attachChannel(298464, { readKey:'A1FE5T3THYNCRH05'});

	return res.json({
        speech: 'The temperature is ' + parsed + ' degrees',
        displayText: 'The temperature is ' + parsed + ' degrees',
        source: 'Brad Auto Respond'
    });
    //return res.json({
    //   speech: speech,
    //    displayText: speech,
    //    source: 'webhook-echo-sample'
    //});
});


restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
