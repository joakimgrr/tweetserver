import request from 'request';
import express from 'express';
import NodeCache from 'node-cache';

const config = require('./config');
const concated = config.twitter.consumer_key + ':' + config.twitter.consumer_secret;
const twitterCache = new NodeCache();

const twitterApiUrl = 'https://api.twitter.com';
const url = twitterApiUrl + '/oauth2/token';
const url2 = twitterApiUrl + '/1.1/statuses/user_timeline.json?count=10&screen_name=' + config.screen_name
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
            let data = JSON.parse(body);
            twitterCache.set(config.screen_name, data, 600);
            console.log('fetching tweets and setting cache');
            res.json(data);
        } catch(e) { }

        res.end();
    })
}

let respondFromCache = (req, res, next) => {
    twitterCache.get(config.screen_name, (err, value) => {
        if (!err) {
            if (value !== undefined) {
                console.log('responding from cache');
                res.json(value);
                res.end();
            } else {
               next();
           }
        }
    })
}

app.get('/', respondFromCache, getBearerToken, getUserWall);
app.listen(port);

console.log(`listening to port *:${port}`);
