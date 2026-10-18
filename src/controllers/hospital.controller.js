import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Hospital } from '../models/Hospital.model.js';
import * as authService from '../services/auth.service.js';

const findHospitalByIdOrSeq = async (idParam) => {
  const query = mongoose.isValidObjectId(idParam)
    ? { _id: idParam }
    : { id: Number(idParam) };
  return Hospital.findOne(query);
};

export const createHospital = asyncHandler(async (req, res) => {
  const result = await authService.registerHospital(req.body);
  return res.status(201).json(result);
});

export const loginHospital = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginHospital(email, password);
  return res.status(200).json(result);
});

export const getHospitalById = asyncHandler(async (req, res) => {
  const hospital = await findHospitalByIdOrSeq(req.params.id);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }

  return res.status(200).json({
    name: hospital.name,
    type: hospital.type,
    phone: hospital.phone,
    alternative_phone1: hospital.alternative_phone1,
    alternative_phone2: hospital.alternative_phone2,
    email: hospital.email,
    site: hospital.site,
    city: hospital.city,
    zipcode: hospital.zipcode,
    state: hospital.state,
    address: hospital.address,
    district: hospital.district
  });
});

export const updateHospitalById = asyncHandler(async (req, res) => {
  const hospital = await findHospitalByIdOrSeq(req.params.id);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }

  // Enforce ownership: only the hospital itself can update its record
  if (
    req.hospital._id.toString() !== hospital._id.toString() &&
    req.hospital.id !== hospital.id
  ) {
    throw new ApiError(403, 'Forbidden: You cannot modify another hospital account.');
  }

  Object.assign(hospital, req.body);
  await hospital.save();

  return res.status(200).json({
    id: hospital.id,
    name: hospital.name,
    phone: hospital.phone,
    email: hospital.email
  });
});

export const deleteHospitalById = asyncHandler(async (req, res) => {
  const hospital = await findHospitalByIdOrSeq(req.params.id);
  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }

  // Enforce ownership
  if (
    req.hospital._id.toString() !== hospital._id.toString() &&
    req.hospital.id !== hospital.id
  ) {
    throw new ApiError(403, 'Forbidden: You cannot delete another hospital account.');
  }

  await Hospital.findByIdAndDelete(hospital._id);
  return res.status(204).send();
});

export const changeHospitalPassword = asyncHandler(async (req, res) => {
  const hospital = req.hospital;
  const { old_password, new_password } = req.body;

  const isMatch = await hospital.comparePassword(old_password);
  if (!isMatch) {
    throw new ApiError(400, 'Incorrect old password.');
  }

  hospital.password = new_password;
  await hospital.save();

  return res.status(200).json({ message: 'Hospital password updated successfully' });
});
