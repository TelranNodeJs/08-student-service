import winston from "winston";

const logger = winston.createLogger({
    level: 'http',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({level, message, timestamp}) => {
            return `[${timestamp}] ${level}: ${message.trim()}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: './app.log'}),
    ]
});
export default logger;