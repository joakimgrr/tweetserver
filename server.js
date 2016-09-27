import express from 'express';

const config = require('./config');
import {getBearerToken, getUserWall, respondFromCache} from './middleware'

const twitterApiUrl = 'https://api.twitter.com';
const tokenUrl = twitterApiUrl + '/oauth2/token';
const timelineUrl = twitterApiUrl + '/1.1/statuses/user_timeline.json?count=10&screen_name=' + config.screen_name;

const concated = config.twitter.consumer_key + ':' + config.twitter.consumer_secret;
const credentials = new Buffer(concated).toString('base64');

let app = express();
let port = process.env.PORT || 8080;

let getConfig = (req, res, next) => {
    let settings = {
        config,
        tokenUrl,
        timelineUrl,
        credentials
    };

    Object.assign(req, settings);
    next();
}

app.get('/', getConfig, respondFromCache, getBearerToken, getUserWall);
app.listen(port);

console.log(`listening to port *:${port}`);
