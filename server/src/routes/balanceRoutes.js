import express from 'express';
import { getBalance } from '../controller/balanceController.js';
import { validateBalance } from '../middleware/validateBalance.js';
import { checkAuthen } from '../middleware/checkAuthen.js';

const balanceRouter = express.Router();

balanceRouter.get('/', checkAuthen, getBalance);

export default balanceRouter;