import NodeCache from 'node-cache';
import request from 'request';
import chalk from 'chalk';

import utils from './utils';

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
                utils.notify('Fetching tweets and setting cache');
                res.json(data);
            } catch(e) { }

            res.end();
        })
    },

    respondFromCache(req, res, next) {
        twitterCache.get(req.config.screen_name, (err, value) => {
            if (!err) {
                if (value !== undefined) {
                    utils.notify('Responding from cache');
                    res.json(value);
                    res.end();
                } else {
                   next();
               }
            }
        })
    },

    addCorsHeaders(req, res, next) {
        // If CORS is not configured or disabled do nothing
        if(!req.config.cors || !req.config.cors.enabled) return next();

        // If whitelist is present but our ip is not whitelisted do nothing.
        const whitelist = req.config.cors.ip_whitelist;
        const remoteAddr = req.connection.remoteAddress;
        if (whitelist && !whitelist.includes(remoteAddr)) return next();

        utils.notify(`Setting CORS headers for: ${chalk.green(remoteAddr)}`);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
    }

}
