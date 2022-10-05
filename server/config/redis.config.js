import url from 'url';

let redisConfig = {};

if (process.env.REDIS_URL) {
    let redisURL = url.parse(process.env.REDIS_URL);
    redisConfig.url = process.env.REDIS_URL;
    redisConfig.port = redisURL.port;
    redisConfig.host = redisURL.hostname;
    redisConfig.password = redisURL.auth.split(':')[1];
} else if (process.env.REDIS_PORT || process.env.REDIS_HOST) {
    redisConfig.port = process.env.REDIS_PORT;
    redisConfig.host = process.env.REDIS_HOST;
    redisConfig.url = `redis://${redisConfig.host}:${redisConfig.port}`;
} else {
    redisConfig.port = 6379;
    redisConfig.host = '127.0.0.1';
    redisConfig.url = `redis://${redisConfig.host}:${redisConfig.port}`;
}

console.log(`Redis Config: ${redisConfig}`);

module.exports = redisConfig;
