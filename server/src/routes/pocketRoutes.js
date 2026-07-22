import express from 'express';
import { getAllPocket, addPocket, changePocketName, deletePocket, changePocketLimit } from '../controller/pocketController.js';
import { validateAddPocket, validateAvailablePocket } from '../middleware/validatePocket.js';
import { checkAuthen } from '../middleware/checkAuthen.js';

const pocketRouter = express.Router();

pocketRouter.get('/', checkAuthen, getAllPocket);
pocketRouter.post('/add', checkAuthen, validateAddPocket, addPocket);
pocketRouter.put('/:id/name', checkAuthen, validateAvailablePocket, changePocketName);
pocketRouter.put('/:id/limit', checkAuthen, validateAvailablePocket, changePocketLimit);
pocketRouter.delete('/:id', checkAuthen, validateAvailablePocket, deletePocket);

// transaction

export default pocketRouter;