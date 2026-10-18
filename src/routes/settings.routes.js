import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { notificationPreferenceUpdateSchema } from '../validators/settings.validator.js';

const router = Router();

router.use(authenticateUser);

router.get('/notifications', settingsController.getNotificationPreferences);
router.patch(
  '/notifications',
  validate(notificationPreferenceUpdateSchema),
  settingsController.updateNotificationPreferences
);

export default router;
