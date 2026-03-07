import { Router } from 'express';
import { createRegister } from '../controllers/CreateRegister.js';
const router = Router();

router.post('/', createRegister);

export default router;
