import { ApiError } from '../utils/ApiError.js';

/**
 * Zod validation middleware factory.
 * Validates req.body, req.query, or req.params against a Zod schema.
 * Returns 422 with FastAPI-compatible detail list if validation fails.
 *
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'query' | 'params'} source
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];
    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        loc: [source, ...err.path],
        msg: err.message,
        type: err.code
      }));

      return next(new ApiError(422, 'Validation Error', formattedErrors));
    }

    // Assign sanitized / parsed data back to req
    req[source] = result.data;
    next();
  };
};
