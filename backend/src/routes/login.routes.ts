import { Router } from 'express';
import { createLogin } from '../controllers/CreateLogin.js';
import { loginRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/', loginRateLimiter, createLogin);

export default router;
