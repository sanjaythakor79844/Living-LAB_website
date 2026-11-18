import Enquiry from '../models/enquiry.model.js';
import { getDatabaseStatus } from '../config/database.js';
import logger from '../utils/logger.js';

// In-memory fallback if MongoDB connection is pending, offline, or unconfigured
const inMemoryEnquiries = [];

export async function saveEnquiry(enquiryData) {
  const dbStatus = getDatabaseStatus();

  if (dbStatus.status === 'connected') {
    try {
      const newEnquiry = await Enquiry.create(enquiryData);
      logger.info('Enquiry stored in MongoDB Atlas', { id: newEnquiry._id, email: newEnquiry.email });
      return {
        id: String(newEnquiry._id),
        name: newEnquiry.name,
        mobile: newEnquiry.mobile,
        email: newEnquiry.email,
        organization: newEnquiry.organization,
        subject: newEnquiry.subject,
        message: newEnquiry.message,
        status: newEnquiry.status,
        createdAt: newEnquiry.createdAt,
        storage: 'mongodb',
      };
    } catch (err) {
      logger.error('Failed saving to MongoDB, falling back to memory store:', { error: err.message });
    }
  }

  // Resilient in-memory storage fallback
  const id = 'enq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const record = {
    id,
    ...enquiryData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    storage: 'memory',
  };
  inMemoryEnquiries.push(record);
  logger.info('Enquiry stored in local memory fallback', { id, email: enquiryData.email });
  return record;
}

export async function getEnquiries() {
  const dbStatus = getDatabaseStatus();
  if (dbStatus.status === 'connected') {
    try {
      return await Enquiry.find().sort({ createdAt: -1 });
    } catch (err) {
      logger.error('Failed reading from MongoDB:', { error: err.message });
    }
  }
  return inMemoryEnquiries;
}

export default {
  saveEnquiry,
  getEnquiries,
};
