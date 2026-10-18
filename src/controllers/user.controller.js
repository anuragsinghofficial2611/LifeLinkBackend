import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';
import { UserActivity } from '../models/UserActivity.model.js';

export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    blood_group: user.blood_group,
    age: user.age,
    sex: user.sex,
    created_at: user.created_at,
    updated_at: user.updated_at
  });
});

export const getUserActivity = asyncHandler(async (req, res) => {
  const activities = await UserActivity.find({ user: req.user._id })
    .sort({ created_at: -1 })
    .limit(50);

  const formatted = activities.map((act) => ({
    activity_type: act.activity_type,
    details: act.details,
    created_at: act.created_at
  }));

  return res.status(200).json(formatted);
});

export const updateUserSettings = asyncHandler(async (req, res) => {
  const user = req.user;
  const { name, phone } = req.body;

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;

  await user.save();

  await UserActivity.create({
    user: user._id,
    activity_type: 'Settings Updated',
    details: 'User profile settings were modified.'
  });

  return res.status(200).json({
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    blood_group: user.blood_group,
    age: user.age,
    sex: user.sex,
    created_at: user.created_at,
    updated_at: user.updated_at
  });
});

export const changeUserPassword = asyncHandler(async (req, res) => {
  const user = req.user;
  const { old_password, new_password } = req.body;

  const isMatch = await user.comparePassword(old_password);
  if (!isMatch) {
    throw new ApiError(400, 'Incorrect old password.');
  }

  user.password = new_password;
  await user.save();

  await UserActivity.create({
    user: user._id,
    activity_type: 'Password Changed',
    details: 'User password was successfully updated.'
  });

  return res.status(200).json({ message: 'Password updated successfully' });
});
