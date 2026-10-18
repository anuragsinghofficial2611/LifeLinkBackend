import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.model.js';
import { Hospital } from '../models/Hospital.model.js';
import { Admin } from '../models/Admin.model.js';
import { NotificationPreference } from '../models/NotificationPreference.model.js';
import { UserActivity } from '../models/UserActivity.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';
import { logger } from '../utils/logger.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

export const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(409, 'A user with this email address already exists.');
  }

  const user = await User.create(userData);

  // Initialize default notification preferences
  await NotificationPreference.create({
    user: user._id,
    email_blood_requests: true,
    sms_emergency_alerts: true,
    push_notifications: true,
    donation_reminders: true
  });

  // Log user registration activity
  await UserActivity.create({
    user: user._id,
    activity_type: 'Account Created',
    details: 'User registered on Lifelink platform.'
  });

  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (!user.is_active) {
    throw new ApiError(403, 'Account is deactivated. Please contact support.');
  }

  const token = generateToken({
    id: user._id,
    user_id: user.id,
    email: user.email,
    name: user.name,
    role: ROLES.USER
  });

  return {
    access_token: token,
    token_type: 'bearer',
    user: {
      name: user.name,
      email: user.email,
      user_id: user.id
    }
  };
};

export const registerHospital = async (hospitalData) => {
  const existing = await Hospital.findOne({ email: hospitalData.email });
  if (existing) {
    throw new ApiError(409, 'A hospital with this email already exists.');
  }

  const hospital = await Hospital.create(hospitalData);

  const token = generateToken({
    id: hospital._id,
    hospital_id: hospital.id,
    email: hospital.email,
    name: hospital.name,
    role: ROLES.HOSPITAL
  });

  return {
    access_token: token,
    token_type: 'bearer',
    hospital: {
      name: hospital.name,
      hospital_id: hospital.id,
      email: hospital.email
    }
  };
};

export const loginHospital = async (email, password) => {
  const hospital = await Hospital.findOne({ email: email.toLowerCase() });
  if (!hospital) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isMatch = await hospital.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = generateToken({
    id: hospital._id,
    hospital_id: hospital.id,
    email: hospital.email,
    name: hospital.name,
    role: ROLES.HOSPITAL
  });

  return {
    access_token: token,
    token_type: 'bearer',
    hospital: {
      name: hospital.name,
      hospital_id: hospital.id,
      email: hospital.email
    }
  };
};

export const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    throw new ApiError(401, 'Invalid admin credentials.');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid admin credentials.');
  }

  const token = generateToken({
    id: admin._id,
    admin_id: admin.id,
    email: admin.email,
    name: admin.name,
    role: ROLES.ADMIN
  });

  return {
    access_token: token,
    token_type: 'bearer',
    admin: {
      name: admin.name,
      admin_id: admin.id,
      email: admin.email
    }
  };
};

export const seedInitialAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        name: env.DEFAULT_ADMIN_NAME,
        email: env.DEFAULT_ADMIN_EMAIL.toLowerCase(),
        password: env.DEFAULT_ADMIN_PASSWORD,
        role: ROLES.ADMIN
      });
      logger.info(`Seeded initial default admin account: ${env.DEFAULT_ADMIN_EMAIL}`);
    }
  } catch (err) {
    logger.error('Failed to seed default admin:', err);
  }
};
