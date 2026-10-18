import { asyncHandler } from '../utils/asyncHandler.js';
import { BloodRequest } from '../models/BloodRequest.model.js';
import { Hospital } from '../models/Hospital.model.js';
import { DonorRequest } from '../models/DonorRequest.model.js';

export const getActiveBloodRequests = asyncHandler(async (req, res) => {
  const count = await BloodRequest.countDocuments({
    status: { $in: ['active', 'pending'] }
  });
  return res.status(200).json({ active_blood_requests: count, count });
});

export const getRegisteredHospitals = asyncHandler(async (req, res) => {
  const count = await Hospital.countDocuments({ is_verified: true });
  return res.status(200).json({ registered_hospitals: count, count });
});

export const getTotalDonations = asyncHandler(async (req, res) => {
  const count = await DonorRequest.countDocuments({ status: 'approved' });
  return res.status(200).json({ total_donations: count, count });
});
