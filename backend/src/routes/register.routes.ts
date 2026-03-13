import { Router } from 'express';
import { createRegister } from '../controllers/CreateRegister.js';
import { registerRateLimiter } from '../middleware/rateLimit.middleware.js';
const router = Router();

router.post('/', registerRateLimiter, createRegister);

export default router;
