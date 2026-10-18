import { Router } from 'express';
import * as bloodRequestController from '../controllers/bloodRequest.controller.js';
import {
  authenticateUser,
  authenticateHospital
} from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  bloodRequestCreateSchema,
  bloodRequestUpdateSchema
} from '../validators/bloodRequest.validator.js';

const router = Router();

// User creates a blood request
router.post(
  '/',
  authenticateUser,
  validate(bloodRequestCreateSchema),
  bloodRequestController.createBloodRequest
);

// Hospital views blood requests with pagination
router.get('/', authenticateHospital, bloodRequestController.getBloodRequests);

// Hospital views blood requests by status
router.get('/status', authenticateHospital, bloodRequestController.getBloodRequestStatus);

// Hospital retrieves, updates, or deletes blood request by ID
router.get('/:id', authenticateHospital, bloodRequestController.getBloodRequestById);
router.put(
  '/:id',
  authenticateHospital,
  validate(bloodRequestUpdateSchema),
  bloodRequestController.updateBloodRequest
);
router.delete('/:id', authenticateHospital, bloodRequestController.deleteBloodRequest);

export default router;
