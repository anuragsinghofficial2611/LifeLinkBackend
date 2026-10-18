import { Router } from 'express';
import * as platformStatsController from '../controllers/platformStats.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/active_blood_requests', platformStatsController.getActiveBloodRequests);
router.get('/registered_hospitals', platformStatsController.getRegisteredHospitals);
router.get('/total_donations', platformStatsController.getTotalDonations);

export default router;
