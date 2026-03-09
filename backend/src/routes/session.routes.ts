import { Router } from 'express';
import { getSession } from '../controllers/GetSession.js';

const router = Router();

router.get('/', getSession);

export default router;
