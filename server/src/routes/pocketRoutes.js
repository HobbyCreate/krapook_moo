import express from 'express';
import { getAllPocket, addPocket, changePocketName, deletePocket, changePocketLimit } from '../controller/pocketController.js';
import { validateAddPocket, validateAvailablePocket } from '../middleware/validatePocket.js';

const pocketRouter = express.Router();

pocketRouter.get('/', getAllPocket);
pocketRouter.post('/add', validateAddPocket, addPocket);
pocketRouter.put('/:id/name', validateAvailablePocket, changePocketName);
pocketRouter.put('/:id/limit', validateAvailablePocket, changePocketLimit);
pocketRouter.delete('/:id', validateAvailablePocket, deletePocket);

// transaction

export default pocketRouter;