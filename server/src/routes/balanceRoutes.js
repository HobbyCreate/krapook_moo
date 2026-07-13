import express from 'express';
import { getBalance, addBalance } from '../controller/balanceController.js';
import { validateBalance } from '../middleware/validateBalance.js';

const balanceRouter = express.Router();

balanceRouter.get('/', getBalance);
balanceRouter.post('/add', validateBalance, addBalance);

export default balanceRouter;