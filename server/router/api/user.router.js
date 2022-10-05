import { Router } from 'express';
import { sfWhoAmI } from '../../controller/user.controller';

const UserRouter = Router();

UserRouter.get('/sf-who-am-i', sfWhoAmI);

export default UserRouter;
