import { Router } from 'express';
import * as donorController from '../controllers/donor.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = Router();

// User creates a donor request using their authenticated profile
router.post('/request', authenticateUser, donorController.createDonorRequest);

export default router;
