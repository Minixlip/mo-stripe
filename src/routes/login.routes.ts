import { Router } from 'express';
import { createLogin } from '../controllers/CreateLogin.js';

const router = Router();

router.post('/', createLogin);

router.get('/:id', (req, res) => {
  console.log(req.params.id);
  return res.status(200).json({ message: `HELLO LOGIN FOR ${req.params.id}` });
});

export default router;
