import { Router } from 'express';
import { handleCreateEnquiry, handleGetEnquiries } from '../controllers/enquiry.controller.js';
import validate from '../middleware/validation.middleware.js';
import { createEnquirySchema } from '../validators/enquiry.validator.js';

const router = Router();

router.post('/', validate({ body: createEnquirySchema }), handleCreateEnquiry);
router.get('/', handleGetEnquiries);

export default router;
