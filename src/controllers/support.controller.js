import { asyncHandler } from '../utils/asyncHandler.js';
import { SupportReport } from '../models/SupportReport.model.js';
import { UserActivity } from '../models/UserActivity.model.js';

export const reportIssue = asyncHandler(async (req, res) => {
  const user = req.user;
  const { subject, description } = req.body;

  const report = await SupportReport.create({
    user: user._id,
    subject,
    description,
    status: 'pending'
  });

  await UserActivity.create({
    user: user._id,
    activity_type: 'Support Issue Reported',
    details: `Ticket #${report.id}: ${subject}`
  });

  return res.status(201).json({
    id: report.id,
    subject: report.subject,
    description: report.description,
    status: report.status,
    created_at: report.created_at
  });
});
