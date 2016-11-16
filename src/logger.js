import chalk from 'chalk';
import winston from 'winston';
import fs from 'fs';

const logdir = '../log';

if (!fs.existsSync(logdir)) {
    fs.mkdirSync(logdir);
}

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp() {
                const now = new Date();

                return `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString('en-GB', {hour12: false})}`
            },
            formatter(options) {
                let color;
                if(options.level === 'info') {
                    color = 'bgGreen';
                } else if (options.level === 'error') {
                    color = 'bgRed';
                }
                return `${options.timestamp()} - ${chalk.blue('Tweetserver')} ${chalk[color](options.level)} ${(options.message || '')}`
            },
        }),

        new (winston.transports.File)({
            filename: `${logdir}/server.log`
        })
    ]
});

export default logger;
