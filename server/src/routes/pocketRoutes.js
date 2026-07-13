import express from 'express';
import { getAllPocket, addPocket, deletePocket } from '../controller/pocketController.js';
import { validateAddPocket, validateDeletePocket } from '../middleware/validatePocket.js';

const pocketRouter = express.Router();

pocketRouter.get('/', getAllPocket);
pocketRouter.post('/add', validateAddPocket, addPocket);
pocketRouter.delete('/:id', validateDeletePocket, deletePocket);

export default pocketRouter;