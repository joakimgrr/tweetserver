
# Tweetserver
Caches and serves users timeline for an easy frontend access

## Setup
1. Create a "config.js" file (check example config file from beneath)
2. Fill in your consumer key and secret that you get from your twitter account
3. Fill in a screen name from which timeline is fetched
4. Run "npm start"
5. Access timeline from http://localhost:8080

## Example config file
Create a "config.js" file to project root

```javascript
module.exports = {
    'screen_name' : '',
    'twitter' : {
        consumer_key: '',
        consumer_secret: '',
    }
}
```

## Future improvements 
- Support for multiple user walls
- Configurable port and amount of tweets fetched
- Make code better overall (atm a one night hack)
