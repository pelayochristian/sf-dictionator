import * as dotenv from 'dotenv';
import sessionConfig from './config/session.config';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import CustomErrorHandler from './middleware/custom-error-handler.md';
import express from 'express';
import next from 'next';
import MainRouter from './router/main.router';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

dotenv.config();

app.prepare().then(() => {
    const server = express();
    // Server pre-config
    server.use(sessionConfig);
    server.use(logger('dev'));
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));
    server.use(cookieParser());
    server.use(express.static(path.join(__dirname, '../client/build')));

    // Router
    server.use(MainRouter);

    // NextJS Handler
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    // Global Error Handler
    server.use(CustomErrorHandler);

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
