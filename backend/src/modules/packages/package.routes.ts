import { Router } from 'express';
import { getPackageBySlugController, getPackagesController } from './package.controller.ts';
import { getPackageDeparturesController } from '../departures/departure.controller.ts';

const router = Router();

router.get('/', getPackagesController);
router.get('/:packageId/departures', getPackageDeparturesController);
router.get('/:slug', getPackageBySlugController);

export default router;
