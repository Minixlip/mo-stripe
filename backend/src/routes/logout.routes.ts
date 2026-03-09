import { Router } from 'express';
import { createLogout } from '../controllers/CreateLogout.js';

const router = Router();

router.post('/', createLogout);

export default router;
