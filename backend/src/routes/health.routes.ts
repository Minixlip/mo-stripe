import { Router } from 'express';
import { getHealth } from '../controllers/GetHealth.js';

const router = Router();

router.get('/', getHealth);

export default router;
