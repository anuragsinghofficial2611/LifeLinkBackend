import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  userSettingsUpdateSchema,
  changePasswordSchema
} from '../validators/user.validator.js';

const router = Router();

router.use(authenticateUser);

router.get('/me', userController.getCurrentUserProfile);
router.get('/activity', userController.getUserActivity);
router.put('/settings', validate(userSettingsUpdateSchema), userController.updateUserSettings);
router.put('/settings/', validate(userSettingsUpdateSchema), userController.updateUserSettings);
router.put('/settings/password', validate(changePasswordSchema), userController.changeUserPassword);

export default router;
