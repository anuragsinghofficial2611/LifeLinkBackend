import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { adminLoginSchema } from '../validators/admin.validator.js';

const router = Router();

// Public admin login
router.post('/login', validate(adminLoginSchema), adminController.loginAdmin);

// Protected admin endpoints
router.get('/hospitals/pending', authenticateAdmin, adminController.getPendingHospitals);
router.put('/hospitals/:id/verify', authenticateAdmin, adminController.verifyHospital);

export default router;
