import { Counter } from '../models/Counter.model.js';

/**
 * Gets the next sequence number for a named sequence.
 *
 * @param {string} sequenceName
 * @returns {Promise<number>}
 */
export const getNextSequence = async (sequenceName) => {
  const counter = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};
