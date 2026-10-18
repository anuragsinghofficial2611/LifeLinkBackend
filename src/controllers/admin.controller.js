import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Hospital } from '../models/Hospital.model.js';
import * as authService from '../services/auth.service.js';

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginAdmin(email, password);
  return res.status(200).json(result);
});

export const getPendingHospitals = asyncHandler(async (req, res) => {
  const pendingHospitals = await Hospital.find({ is_verified: false }).sort({ created_at: -1 });

  const formatted = pendingHospitals.map((h) => ({
    id: h.id,
    name: h.name,
    phone: h.phone,
    email: h.email
  }));

  return res.status(200).json(formatted);
});

export const verifyHospital = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = mongoose.isValidObjectId(id) ? { _id: id } : { id: Number(id) };

  const hospital = await Hospital.findOne(query);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }

  hospital.is_verified = true;
  await hospital.save();

  return res.status(200).json({ message: 'Hospital verified successfully' });
});
