import express from 'express';
import { getAllPocket, addPocket, changePocketName, deletePocket } from '../controller/pocketController.js';
import { validateAddPocket, validateAvailablePocket } from '../middleware/validatePocket.js';

const pocketRouter = express.Router();

pocketRouter.get('/', getAllPocket);
pocketRouter.post('/add', validateAddPocket, addPocket);
pocketRouter.put('/:id', validateAvailablePocket, changePocketName);
pocketRouter.delete('/:id', validateAvailablePocket, deletePocket);

export default pocketRouter;