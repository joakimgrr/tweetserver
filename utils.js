import chalk from 'chalk';

module.exports = {
    notify(message) {
        console.log(`${chalk.bgCyan('Tweetserver:')} ${message}`);
    }
}
