import { Router } from 'express';
import { sfWhoAmI, signoutUser } from '../../controller/user.controller';

const UserRouter = Router();

UserRouter.get('/sf-who-am-i', sfWhoAmI);
UserRouter.get('/signout', signoutUser);

export default UserRouter;
