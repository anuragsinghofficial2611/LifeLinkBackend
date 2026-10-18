import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { userRegisterSchema, userLoginSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(userRegisterSchema), authController.register);
router.post('/register/', validate(userRegisterSchema), authController.register);

router.post('/login', validate(userLoginSchema), authController.login);
router.post('/login/', validate(userLoginSchema), authController.login);

export default router;
