import { saveEnquiry, getEnquiries } from '../services/enquiry.service.js';
import { successResponse } from '../utils/response.js';

export async function handleCreateEnquiry(req, res, next) {
  try {
    const saved = await saveEnquiry(req.body);
    return successResponse(res, {
      statusCode: 201,
      message: 'Enquiry submitted successfully. Our team will contact you shortly.',
      data: saved,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetEnquiries(req, res, next) {
  try {
    const list = await getEnquiries();
    return successResponse(res, {
      statusCode: 200,
      message: 'Enquiries retrieved successfully',
      data: list,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  handleCreateEnquiry,
  handleGetEnquiries,
};
