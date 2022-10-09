import session from 'express-session';
import connectRedis from 'connect-redis';
import dotenv from 'dotenv';
import { RedisConfig } from './redis.config';

dotenv.config();

const { port, host, password, url } = RedisConfig();

console.log(
    `Loading Redis Configuration . . . Port: ${port}, Host: ${host}, Password: ${password}, URL: ${url}`
);

// Config Redis Connection
var RedisStore = connectRedis(session);
const Redis = require('ioredis');
let redisClient = password
    ? new Redis({
          port: port,
          host: host,
          password: password,
          db: 0,
      })
    : new Redis(port, host);

const EXPIRE_TIME = 7200000;

let sessionStore = new RedisStore({
    host: host,
    port: port,
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
