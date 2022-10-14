import { Router } from 'express';
import { callback, clientId } from '../../controller/oauth.controller';

const OauthRouter = Router();

OauthRouter.get('/callback', callback);
OauthRouter.get('/clientId', clientId);

export default OauthRouter;
