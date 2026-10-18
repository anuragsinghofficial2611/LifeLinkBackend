import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';
import { Hospital } from '../models/Hospital.model.js';
import { Admin } from '../models/Admin.model.js';
import { ROLES } from '../constants/roles.js';

/**
 * Extracts and decodes Bearer token from Authorization header or cookie.
 */
const extractAndVerifyToken = (req) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError(401, 'Not authenticated. Bearer token missing.');
  }

  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token has expired. Please log in again.');
    }
    throw new ApiError(401, 'Invalid or malformed authentication token.');
  }
};

/**
 * Middleware for UserOAuth2 (Authenticates User).
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const decoded = extractAndVerifyToken(req);

    if (decoded.role && decoded.role !== ROLES.USER) {
      throw new ApiError(403, 'Forbidden: User credentials required.');
    }

    const user = await User.findOne({
      $or: [{ _id: decoded.id }, { id: decoded.user_id || decoded.id }]
    });

    if (!user) {
      throw new ApiError(401, 'User account not found or has been removed.');
    }

    if (!user.is_active) {
      throw new ApiError(403, 'User account is deactivated.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware for HospitalOAuth2 (Authenticates Hospital).
 */
export const authenticateHospital = async (req, res, next) => {
  try {
    const decoded = extractAndVerifyToken(req);

    if (decoded.role && decoded.role !== ROLES.HOSPITAL) {
      throw new ApiError(403, 'Forbidden: Hospital credentials required.');
    }

    const hospital = await Hospital.findOne({
      $or: [{ _id: decoded.id }, { id: decoded.hospital_id || decoded.id }]
    });

    if (!hospital) {
      throw new ApiError(401, 'Hospital account not found or has been removed.');
    }

    req.hospital = hospital;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware for AdminOAuth2 (Authenticates Admin).
 */
export const authenticateAdmin = async (req, res, next) => {
  try {
    const decoded = extractAndVerifyToken(req);

    if (decoded.role && decoded.role !== ROLES.ADMIN) {
      throw new ApiError(403, 'Forbidden: Admin access required.');
    }

    const admin = await Admin.findOne({
      $or: [{ _id: decoded.id }, { id: decoded.admin_id || decoded.id }]
    });

    if (!admin) {
      throw new ApiError(401, 'Admin account not found.');
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};
