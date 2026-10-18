import { Router } from 'express';
import * as hospitalController from '../controllers/hospital.controller.js';
import { authenticateHospital } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  hospitalBaseSchema,
  hospitalLoginSchema
} from '../validators/hospital.validator.js';
import { changePasswordSchema } from '../validators/user.validator.js';

const router = Router();

// Public hospital endpoints
router.post('/', validate(hospitalBaseSchema), hospitalController.createHospital);
router.post('/login', validate(hospitalLoginSchema), hospitalController.loginHospital);

// Protected hospital settings
router.put(
  '/settings/password',
  authenticateHospital,
  validate(changePasswordSchema),
  hospitalController.changeHospitalPassword
);

// Protected hospital CRUD by ID
router.get('/:id', authenticateHospital, hospitalController.getHospitalById);
router.put(
  '/:id',
  authenticateHospital,
  validate(hospitalBaseSchema),
  hospitalController.updateHospitalById
);
router.delete('/:id', authenticateHospital, hospitalController.deleteHospitalById);

export default router;
