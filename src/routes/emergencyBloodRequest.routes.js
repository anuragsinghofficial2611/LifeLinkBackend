import { Router } from 'express';
import * as emergencyBloodRequestController from '../controllers/emergencyBloodRequest.controller.js';
import {
  authenticateUser,
  authenticateHospital
} from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { emergencyBloodRequestSchema } from '../validators/emergencyBloodRequest.validator.js';

const router = Router();

// User broadcasts emergency blood request to all hospitals
router.post(
  '/create-emergency-blood-request',
  authenticateUser,
  validate(emergencyBloodRequestSchema),
  emergencyBloodRequestController.createEmergencyBloodRequestFromUser
);

// Hospital broadcasts emergency blood request to other hospitals
router.post(
  '/create-emergency-blood-request-hospital',
  authenticateHospital,
  validate(emergencyBloodRequestSchema),
  emergencyBloodRequestController.createEmergencyBloodRequestFromHospital
);

// Hospital views all emergency blood requests
router.get(
  '/get-emergency-blood-requests',
  authenticateHospital,
  emergencyBloodRequestController.getEmergencyBloodRequests
);

export default router;
