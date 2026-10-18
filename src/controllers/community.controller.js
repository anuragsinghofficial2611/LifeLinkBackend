import { asyncHandler } from '../utils/asyncHandler.js';
import { CommunityPost } from '../models/CommunityPost.model.js';
import { UserActivity } from '../models/UserActivity.model.js';

export const getCommunityPosts = asyncHandler(async (req, res) => {
  const posts = await CommunityPost.find().sort({ created_at: -1 });

  const formatted = posts.map((p) => ({
    id: p.id,
    message: p.message,
    user_name: p.user_name,
    created_at: p.created_at
  }));

  return res.status(200).json(formatted);
});

export const createCommunityPost = asyncHandler(async (req, res) => {
  const user = req.user;
  const { message } = req.body;

  const post = await CommunityPost.create({
    user: user._id,
    user_name: user.name,
    message
  });

  await UserActivity.create({
    user: user._id,
    activity_type: 'Community Post',
    details: 'User published a message in the community feed.'
  });

  return res.status(201).json({
    id: post.id,
    message: post.message,
    user_name: post.user_name,
    created_at: post.created_at
  });
});
