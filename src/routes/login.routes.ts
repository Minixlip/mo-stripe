import { Router } from 'express';
import { createLogin } from '../controllers/CreateLogin.js';

const router = Router();

router.post('/login', createLogin);

router.get('/login', (req, res) => {
  return res.status(200).json({ message: 'HELLO LOGIN' });
});

export default router;
