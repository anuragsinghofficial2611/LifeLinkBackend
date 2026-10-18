import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import hospitalRoutes from './hospital.routes.js';
import adminRoutes from './admin.routes.js';
import platformStatsRoutes from './platformStats.routes.js';
import bloodRequestRoutes from './bloodRequest.routes.js';
import donorRoutes from './donor.routes.js';
import hospitalDonorRoutes from './hospitalDonor.routes.js';
import emergencyBloodRequestRoutes from './emergencyBloodRequest.routes.js';
import notificationRoutes from './notification.routes.js';
import settingsRoutes from './settings.routes.js';
import communityRoutes from './community.routes.js';
import supportRoutes from './support.routes.js';
import chatRoutes from './chat.routes.js';

const router = Router();

// Root and Health Endpoints
router.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok' });
});

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Welcome to Lifelink API' });
});

// API v1 Routes
router.use('/api/v1', authRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/hospitals', hospitalRoutes);
router.use('/api/v1/admin', adminRoutes);
router.use('/api/v1/platform-stats', platformStatsRoutes);
router.use('/api/v1/blood-requests', bloodRequestRoutes);
router.use('/api/v1/donor', donorRoutes);
router.use('/api/v1/Donor_Hospital', hospitalDonorRoutes);
router.use('/api/v1/emergency-blood-request', emergencyBloodRequestRoutes);
router.use('/api/v1/notifications', notificationRoutes);
router.use('/api/v1/settings', settingsRoutes);
router.use('/api/v1/community', communityRoutes);
router.use('/api/v1/support', supportRoutes);
router.use('/api/v1/chat', chatRoutes);

export default router;
