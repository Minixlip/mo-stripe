import { Router } from 'express';
import { createLogin } from '../controllers/CreateLogin.js';

const router = Router();

router.post('/', createLogin);

export default router;
