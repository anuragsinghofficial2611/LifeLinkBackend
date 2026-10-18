/**
 * Standard API Response structure
 */
export class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  /**
   * Helper to send response matching either OpenAPI root object or wrapped structure
   */
  static send(res, statusCode, data) {
    return res.status(statusCode).json(data);
  }
}
