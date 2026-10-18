import { Router } from 'express';
import * as supportController from '../controllers/support.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { supportReportCreateSchema } from '../validators/support.validator.js';

const router = Router();

router.post(
  '/report',
  authenticateUser,
  validate(supportReportCreateSchema),
  supportController.reportIssue
);

export default router;
