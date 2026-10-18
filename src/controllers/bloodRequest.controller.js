import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { BloodRequest } from '../models/BloodRequest.model.js';
import { UserActivity } from '../models/UserActivity.model.js';

const formatBloodRequest = (doc) => ({
  id: doc.id,
  patient_name: doc.patient_name,
  guardian_name: doc.guardian_name,
  phone: doc.phone,
  additional_phone: doc.additional_phone,
  blood_group: doc.blood_group,
  age: doc.age,
  sex: doc.sex,
  quantity: doc.quantity,
  longitude: doc.longitude,
  latitude: doc.latitude,
  geohash_64_bits: doc.geohash_64_bits,
  status: doc.status
});

const findBloodRequestByIdOrSeq = async (idParam) => {
  const query = mongoose.isValidObjectId(idParam)
    ? { _id: idParam }
    : { id: Number(idParam) };
  return BloodRequest.findOne(query);
};

export const createBloodRequest = asyncHandler(async (req, res) => {
  const bloodRequest = await BloodRequest.create({
    ...req.body,
    user: req.user._id,
    status: 'active'
  });

  // Log user activity
  await UserActivity.create({
    user: req.user._id,
    activity_type: 'Created Blood Request',
    details: `Blood request created for ${bloodRequest.patient_name} (${bloodRequest.blood_group})`
  });

  return res.status(201).json(formatBloodRequest(bloodRequest));
});

export const getBloodRequests = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip || '0', 10);
  const limit = parseInt(req.query.limit || '50', 10);

  const requests = await BloodRequest.find()
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(requests.map(formatBloodRequest));
});

export const getBloodRequestStatus = asyncHandler(async (req, res) => {
  const requests = await BloodRequest.find().sort({ created_at: -1 });
  return res.status(200).json(requests.map(formatBloodRequest));
});

export const getBloodRequestById = asyncHandler(async (req, res) => {
  const bloodRequest = await findBloodRequestByIdOrSeq(req.params.id);
  if (!bloodRequest) {
    throw new ApiError(404, 'Blood request not found');
  }

  return res.status(200).json(formatBloodRequest(bloodRequest));
});

export const updateBloodRequest = asyncHandler(async (req, res) => {
  const bloodRequest = await findBloodRequestByIdOrSeq(req.params.id);
  if (!bloodRequest) {
    throw new ApiError(404, 'Blood request not found');
  }

  bloodRequest.status = req.body.status;
  await bloodRequest.save();

  return res.status(200).json(formatBloodRequest(bloodRequest));
});

export const deleteBloodRequest = asyncHandler(async (req, res) => {
  const bloodRequest = await findBloodRequestByIdOrSeq(req.params.id);
  if (!bloodRequest) {
    throw new ApiError(404, 'Blood request not found');
  }

  await BloodRequest.findByIdAndDelete(bloodRequest._id);
  return res.status(200).json({ message: 'Blood request deleted successfully' });
});
