import { Router } from 'express';
import { getAccount } from '../controllers/GetAccount.js';
import { authenticateRequest } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateRequest, getAccount);

export default router;
