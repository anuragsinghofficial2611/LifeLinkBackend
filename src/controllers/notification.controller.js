import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Notification } from '../models/Notification.model.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    created_at: -1
  });

  const formatted = notifications.map((n) => ({
    id: n.id,
    message: n.message,
    is_read: n.is_read,
    created_at: n.created_at
  }));

  return res.status(200).json(formatted);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = mongoose.isValidObjectId(id)
    ? { _id: id, user: req.user._id }
    : { id: Number(id), user: req.user._id };

  const notification = await Notification.findOne(query);
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  notification.is_read = true;
  await notification.save();

  return res.status(200).json({
    id: notification.id,
    message: notification.message,
    is_read: notification.is_read,
    created_at: notification.created_at
  });
});
