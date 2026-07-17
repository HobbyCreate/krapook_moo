import express from 'express';
import { validateAddPocket, validateAvailablePocket } from '../middleware/validatePocket.js';
import { getAllTransactions, insertNewTransaction } from '../controller/transactionController.js'

const transactionRouter = express.Router();

transactionRouter.get('/', getAllTransactions);       
transactionRouter.post('/', validateAvailablePocket, insertNewTransaction);       
transactionRouter.put('/:id', updateTransaction);


export default transactionRouter;