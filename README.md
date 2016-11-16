
# Tweetserver
Caches and serves users timeline for an easy frontend access

## Setup
1. Create a "config.js" file (check example config file from beneath)
2. Fill in your consumer key and secret that you get from your twitter account
3. Fill in a screen name from which timeline is fetched
4. Run "npm start"
5. Access timeline from http://localhost:8080

## Configure CORS
Enable CORS in config (shown in example config file).

If you want to limit IP-addresses that get CORS headers you can add a array of IP's that get them.

## Example config file
Create a "config.js" file to project root

```javascript
module.exports = {
    'screen_name' : '',
    'twitter' : {
        consumer_key: '',
        consumer_secret: '',
    },
    url_parameters: [
        'count=10',
        'include_rts=true',
        'exclude_replies=true'
    ],
    cors: {
        enabled: true,
        ip_whitelist: [
            '::1',
            '123.456.789.12'
        ]
    }
}
```

## Future improvements
- Support for multiple user walls
