import url from 'url';

export const RedisConfig = () => {
    if (process.env.REDIS_URL) {
        return {
            url: process.env.REDIS_URL,
            port: 'redisURL.port',
            host: redisURL.hostname,
            password: url.parse(process.env.REDIS_URL).auth.split(':')[1],
        };
    } else if (process.env.REDIS_PORT || process.env.REDIS_HOST) {
        return {
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        };
    } else {
        return {
            port: 6379,
            host: '127.0.0.1',
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        };
    }
};
