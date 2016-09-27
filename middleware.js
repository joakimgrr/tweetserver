import NodeCache from 'node-cache';
import request from 'request';

const twitterCache = new NodeCache();

module.exports = {

    getBearerToken(req, res, next) {
        request({
            url: req.tokenUrl,
            method: 'POST',
            headers: {
                "Authorization": "Basic " + req.credentials,
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
    },

    getUserWall(req, res, next) {
        request({
            url: req.timelineUrl,
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + req.bearer_token
            }
        }, (err, response, body) => {
            try {
                let data = JSON.parse(body);
                twitterCache.set(req.config.screen_name, data, 600);
                console.log('fetching tweets and setting cache');
                res.json(data);
            } catch(e) { }

            res.end();
        })
    },

    respondFromCache(req, res, next) {
        twitterCache.get(req.config.screen_name, (err, value) => {
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

}
