var request = require('request');
var express = require('express');

const config = require('./config');
const concated = config.twitter.consumer_key + ':' + config.twitter.consumer_secret;

const twitterApiUrl = 'https://api.twitter.com';
const url = twitterApiUrl + '/oauth2/token';
const url2 = twitterApiUrl + '/1.1/statuses/user_timeline.json?count=10&screen_name=sysartoy'
const credentials = new Buffer(concated).toString('base64');

let app = express();
let port = process.env.PORT || 8080;

let getBearerToken = (req, res, next) => {
    request({
        url: url,
        method: 'POST',
        headers: {
            "Authorization": "Basic " + credentials,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: "grant_type=client_credentials"
    }, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            try {
                body = JSON.parse(body);
                req.bearer_token = body.access_token;
                next();
            } catch(e) {
                res.end();
            }
        }
    })
}

let getUserWall = (req, res, next) => {
    request({
        url: url2,
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + req.bearer_token
        }
    }, (err, response, body) => {
        try {
            res.json(JSON.parse(body));
        } catch(e) { }

        res.end();
    })
}

app.get('/', getBearerToken, getUserWall);
app.listen(port);

console.log(`listening to port *:${port}`);
