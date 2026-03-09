import { Router } from 'express';
import { getSession } from '../controllers/GetSession.js';
import { authenticateRequest } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateRequest, getSession);

export default router;
