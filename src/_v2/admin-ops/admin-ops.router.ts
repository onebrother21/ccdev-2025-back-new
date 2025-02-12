import { Router } from 'express';
import { AdminOpsController as ctrl } from './admin-ops.controller';
import { AdminOpsValidators as validators } from './admin-ops.validators';
import { AuthJWT,PostMiddleware } from '../../middlewares';
import { Routes } from '../v2-routerstrings';

const routes = Routes.AdminOps
const router = Router();

router.use(AuthJWT);
router.post(routes.jobs.create,[...validators.PostJob,ctrl.PostJob,...PostMiddleware]);

export default router;