import express from 'express';
import { register, login, logout, getMe } from '../controller/authenController.js'; 
import { checkAuthen } from '../middleware/checkAuthen.js';

const authenticationRouter = express.Router();

authenticationRouter.post('/register', register);
authenticationRouter.post('/login', login);
authenticationRouter.post('/logout', logout);
authenticationRouter.get('/getme', checkAuthen, getMe);

export default authenticationRouter;