/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var lyft = require('node-lyft');
var defaultClient = lyft.ApiClient.instance;
var app = express();
var request = require('request');
var bodyParser = require("body-parser");

var phoneNumber;
var accesstoken;
var rideinfo;
var rideestimates;
var lyftuser;

const MessagingResponse = require('twilio').twiml.MessagingResponse;
const accountSID = 'AC145e3566244b3a1aec36b8cd154720cd';
const authToken = 'd978c76cfa20e9f92b501e0b6f849ab2';  
const client = require('twilio')(accountSID, authToken); 
    
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/', (req,res) => {
    const accountSID = 'AC145e3566244b3a1aec36b8cd154720cd';
    const authToken = 'd978c76cfa20e9f92b501e0b6f849ab2';  
    const client = require('twilio')(accountSID, authToken); 
   // var twiml = new MessagingResponse();
    var inbMsg = req.body.Body.toLowerCase().trim();
    const MessageBody = req.body.Body;
    console.log(req.body);
    phoneNumber = req.body.From;
    if(inbMsg === "login") {
        res.send("<Response><Message><![CDATA[https://api.lyft.com/oauth/authorize?client_id=NAg_fd3VlOPk&scope=public%20profile%20rides.read%20rides.request%20offline&state=<state_string>&response_type=code]]></Message></Response>"); 
    };
    if ((inbMsg === "rides") && (accesstoken !== null)) {
        res.send("<Response><Message>" + JSON.stringify(rideinfo) +"</Message></Response>");
    } 
    if ((inbMsg === "estimate") && (accesstoken !== null)) {
        res.send("<Response><Message>" + JSON.stringify(rideestimates) +"</Message></Response>");
    } 
    if ((inbMsg === "user") && (accesstoken !== null)) {
        res.send("<Response><Message>" + lyftuser +"</Message></Response>");
    } 
});

app.get('/', (req, res) => {
    res.redirect('https://api.lyft.com/oauth/authorize?client_id=NAg_fd3VlOPk&scope=public%20profile%20rides.read%20rides.request%20offline&state=<state_string>&response_type=code');
});


app.get('/redir', (req, res) => {
    auth = req.query.code;
    console.log(auth);
    
    request({
        method: 'POST',
        uri: 'https://api.lyft.com/oauth/token',
        auth: {
            username: 'NAg_fd3VlOPk',
            password: '1H38iV2HSgFtVeRvZu3b8Wl0BS_Pry6R'
           },
        json: {
               grant_type: 'authorization_code',
               code: auth
    }
  }, (error, response, body) => {
      console.log(JSON.stringify(body));
      accesstoken = body.access_token;
      console.log(accesstoken);
      let userAuth = defaultClient.authentications['User Authentication'];
      userAuth.accessToken = accesstoken;
    
    var startTime = new Date();
    let apiInstance = new lyft.UserApi();
    apiInstance.getRides(startTime).then((data) => {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        rideinfo = data;
        res.send(JSON.stringify(data));
        }, (error) => {
        console.error(error);
    });
    
    apiInstance.getProfile().then((data) => {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        lyftuser = JSON.stringify(data);
    }, (error) => {
        console.error(error);
    });   
    
    userAuth.accessToken = '3w+luCY1sTOhdK27NXKjd787aL1R6h1qf4iZ9a94b6oGYhEGZUXqF7gU3MadOxZ3M8yxHmFQc8QowJMDnGHJ4GPc9aCWgZ2cgg/mBRYKZE0EC7onEJaM+n0=';
    
    let opts = { 
        'endLat': 37.7972, // Latitude of the ending location
        'endLng': -122.4533 // Longitude of the ending location
    };

    
  });  
});
  

app.listen(8080, () => {
    console.log("Started");
});