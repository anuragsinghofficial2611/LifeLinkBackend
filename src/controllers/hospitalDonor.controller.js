import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { DonorRequest } from '../models/DonorRequest.model.js';
import { Notification } from '../models/Notification.model.js';

const formatDonorRequest = (doc) => ({
  id: doc.id,
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  blood_group: doc.blood_group,
  age: doc.age,
  sex: doc.sex,
  status: doc.status
});

const findDonorRequestByIdOrSeq = async (idParam) => {
  const query = mongoose.isValidObjectId(idParam)
    ? { _id: idParam }
    : { id: Number(idParam) };
  return DonorRequest.findOne(query);
};

export const showDonorToHospital = asyncHandler(async (req, res) => {
  const requests = await DonorRequest.find().sort({ created_at: -1 });
  return res.status(200).json(requests.map(formatDonorRequest));
});

export const updateDonorRequest = asyncHandler(async (req, res) => {
  const donorRequest = await findDonorRequestByIdOrSeq(req.params.id);
  if (!donorRequest) {
    throw new ApiError(404, 'Donor request not found');
  }

  donorRequest.status = req.body.status;
  await donorRequest.save();

  // Create notification for user if donor request has linked user
  if (donorRequest.user) {
    await Notification.create({
      user: donorRequest.user,
      message: `Your blood donor request has been ${donorRequest.status} by ${req.hospital.name}.`
    });
  }

  return res.status(200).json(formatDonorRequest(donorRequest));
});

export const deleteDonorRequest = asyncHandler(async (req, res) => {
  const donorRequest = await findDonorRequestByIdOrSeq(req.params.id);
  if (!donorRequest) {
    throw new ApiError(404, 'Donor request not found');
  }

  await DonorRequest.findByIdAndDelete(donorRequest._id);
  return res.status(200).json({ message: 'Donor request deleted successfully' });
});
