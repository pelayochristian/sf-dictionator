import { Router } from 'express';
import { test } from '../controller/sobject.controller';
import OauthRouter from './api/oauth.router';
import SObjectRouter from './api/sobject.router';
import UserRouter from './api/user.router';

const MainRouter = Router();

MainRouter.use('/oauth2', OauthRouter);
MainRouter.use('/sobject', SObjectRouter);
MainRouter.use('/user', UserRouter);
MainRouter.get('/test', test);

export default MainRouter;
