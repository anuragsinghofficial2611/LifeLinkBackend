import { Router } from 'express';
import * as communityController from '../controllers/community.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { communityPostCreateSchema } from '../validators/community.validator.js';

const router = Router();

// Public community feed
router.get('/', communityController.getCommunityPosts);

// Authenticated user creates post
router.post(
  '/',
  authenticateUser,
  validate(communityPostCreateSchema),
  communityController.createCommunityPost
);

export default router;
