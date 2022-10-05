import session from 'express-session';
import connectRedis from 'connect-redis';
import dotenv from 'dotenv';
import redisConfig from './redis.config';

dotenv.config();

// Config Redis Connection
var RedisStore = connectRedis(session);
const Redis = require('ioredis');
let redisClient = redisConfig.password
    ? new Redis({
          port: redisConfig.port, // Redis port
          host: redisConfig.host, // Redis host
          password: redisConfig.password, // Redis password
          db: 0, // Defaults to 0
          tls: {
              host: redisConfig.host,
          },
      })
    : new Redis(redisConfig.port, redisConfig.host);
// if (redisConfig.password) new Redis(redisConfig.password);

const EXPIRE_TIME = 7200000;

let sessionStore = new RedisStore({
    host: redisConfig.host,
    port: redisConfig.port,
    client: redisClient,
    ttl: EXPIRE_TIME,
    disableTouch: true,
    prefix: 'sfhs-sess',
});

let sessionOptions = {
    secret: process.env.SESSION_SECRET_KEY,
    cookie: {
        maxAge: EXPIRE_TIME,
        httpOnly: false,
    },
    resave: false,
    saveUninitialized: 'false',
    store: sessionStore,
};

let sessionConfig = session(sessionOptions);
module.exports = sessionConfig;
