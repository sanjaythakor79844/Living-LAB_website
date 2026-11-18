import { z } from 'zod';

export const createEnquirySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  mobile: z
    .string({ required_error: 'Mobile number is required' })
    .trim()
    .min(7, 'Mobile number must be at least 7 characters')
    .max(20, 'Mobile number must not exceed 20 characters')
    .regex(/^[0-9+\s\-().]+$/, 'Please enter a valid mobile number'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address')
    .max(150, 'Email must not exceed 150 characters'),
  organization: z
    .string()
    .trim()
    .max(150, 'Organization must not exceed 150 characters')
    .optional()
    .default(''),
  subject: z
    .string({ required_error: 'Subject is required' })
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must not exceed 200 characters'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
});
