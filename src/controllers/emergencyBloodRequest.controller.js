import { asyncHandler } from '../utils/asyncHandler.js';
import { EmergencyBloodRequest } from '../models/EmergencyBloodRequest.model.js';
import { UserActivity } from '../models/UserActivity.model.js';

export const createEmergencyBloodRequestFromUser = asyncHandler(async (req, res) => {
  const { blood_group, additional_remark, notes } = req.body;

  await EmergencyBloodRequest.create({
    source: 'user',
    user: req.user._id,
    blood_group,
    additional_remark,
    notes
  });

  // Log user activity
  await UserActivity.create({
    user: req.user._id,
    activity_type: 'Emergency Blood Request',
    details: `Emergency request for blood group ${blood_group} broadcasted.`
  });

  return res.status(201).json({
    message: 'Emergency blood request created and broadcasted to all hospitals.'
  });
});

export const createEmergencyBloodRequestFromHospital = asyncHandler(async (req, res) => {
  const { blood_group, additional_remark, notes } = req.body;

  await EmergencyBloodRequest.create({
    source: 'hospital',
    hospital: req.hospital._id,
    blood_group,
    additional_remark,
    notes
  });

  return res.status(201).json({
    message: 'Emergency blood request broadcasted to all hospitals successfully.'
  });
});

export const getEmergencyBloodRequests = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip || '0', 10);
  const limit = parseInt(req.query.limit || '50', 10);

  const [userRequests, hospitalRequests] = await Promise.all([
    EmergencyBloodRequest.find({ source: 'user' })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit),
    EmergencyBloodRequest.find({ source: 'hospital' })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
  ]);

  const mapRequest = (reqDoc) => ({
    blood_group: reqDoc.blood_group,
    additional_remark: reqDoc.additional_remark,
    notes: reqDoc.notes
  });

  const responseItem = {
    requests_from_user: userRequests.map(mapRequest),
    requests_from_hospital: hospitalRequests.map(mapRequest)
  };

  // Return array matching schema: items: EmergencyBloodRequestsResponse
  return res.status(200).json([responseItem]);
});
