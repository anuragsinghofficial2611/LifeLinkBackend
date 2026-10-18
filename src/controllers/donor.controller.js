import { asyncHandler } from '../utils/asyncHandler.js';
import { DonorRequest } from '../models/DonorRequest.model.js';
import { UserActivity } from '../models/UserActivity.model.js';

export const createDonorRequest = asyncHandler(async (req, res) => {
  const user = req.user;

  const donorRequest = await DonorRequest.create({
    user: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    blood_group: user.blood_group,
    age: user.age,
    sex: user.sex,
    status: 'pending'
  });

  // Log user activity
  await UserActivity.create({
    user: user._id,
    activity_type: 'Donor Request Submitted',
    details: `User submitted a request to donate blood (${user.blood_group})`
  });

  return res.status(201).json({
    id: donorRequest.id,
    name: donorRequest.name,
    blood_group: donorRequest.blood_group,
    age: donorRequest.age,
    sex: donorRequest.sex,
    phone: donorRequest.phone
  });
});
