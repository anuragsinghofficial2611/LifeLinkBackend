import { asyncHandler } from '../utils/asyncHandler.js';
import * as chatService from '../services/chat.service.js';

export const chat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  const result = await chatService.processChatMessage(message, history || []);
  return res.status(200).json(result);
});
