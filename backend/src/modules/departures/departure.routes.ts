import { Router } from 'express';
import { getDeparturesController } from './departure.controller.ts';

const router = Router();

router.get('/', getDeparturesController);

export default router;
