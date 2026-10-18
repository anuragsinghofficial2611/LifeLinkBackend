import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  const responseData = {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    blood_group: user.blood_group,
    age: user.age,
    sex: user.sex,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
  return res.status(201).json(responseData);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body.email, req.body.password);
  return res.status(200).json(result);
});
