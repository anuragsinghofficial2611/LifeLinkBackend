import { Router } from 'express';
import * as chatController from '../controllers/chat.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { chatRequestSchema } from '../validators/chat.validator.js';

const router = Router();

router.post('/', validate(chatRequestSchema), chatController.chat);

export default router;
