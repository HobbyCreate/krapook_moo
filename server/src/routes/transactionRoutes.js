import express from 'express';
import { validateAddPocket, validateAvailablePocket } from '../middleware/validatePocket.js';
import { getAllTransactions, insertNewTransaction, editTransaction, deleteTransaction } from '../controller/transactionController.js'
import { checkAuthen } from '../middleware/checkAuthen.js';

const transactionRouter = express.Router();

transactionRouter.get('/', checkAuthen, getAllTransactions);       
transactionRouter.post('/add', checkAuthen, insertNewTransaction);   
transactionRouter.put('/:id', checkAuthen, editTransaction);     
transactionRouter.delete('/:id', checkAuthen, deleteTransaction);    

export default transactionRouter;