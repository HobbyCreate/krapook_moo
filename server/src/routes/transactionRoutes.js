import express from 'express';
import { validateAddPocket, validateAvailablePocket } from '../middleware/validatePocket.js';
import { getAllTransactions, insertNewTransaction, editTransaction, deleteTransaction } from '../controller/transactionController.js'

const transactionRouter = express.Router();

transactionRouter.get('/', getAllTransactions);       
transactionRouter.post('/add', insertNewTransaction);   
transactionRouter.put('/:id', editTransaction);     
transactionRouter.delete('/:id', deleteTransaction);    

export default transactionRouter;