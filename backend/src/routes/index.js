import { Router } from 'express';
import healthRoutes from './health.routes.js';
import enquiryRoutes from './enquiry.routes.js';

const apiRouter = Router();

// Mount routes
apiRouter.use('/health', healthRoutes);
apiRouter.use('/enquiries', enquiryRoutes);

export default apiRouter;
