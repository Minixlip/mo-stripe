import { Router } from 'express';
import { createDeposit } from '../controllers/CreateDeposit.js';
import { getAccountTransactionController } from '../controllers/GetAccountTransaction.js';
import { getAccountTransactionsController } from '../controllers/GetAccountTransactions.js';
import { createTransfer } from '../controllers/CreateTransfer.js';
import { createWithdrawal } from '../controllers/CreateWithdrawal.js';
import { getAccount } from '../controllers/GetAccount.js';
import { authenticateRequest } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateRequest, getAccount);
router.get('/transactions', authenticateRequest, getAccountTransactionsController);
router.get(
  '/transactions/:transactionId',
  authenticateRequest,
  getAccountTransactionController,
);
router.post('/deposit', authenticateRequest, createDeposit);
router.post('/withdraw', authenticateRequest, createWithdrawal);
router.post('/transfer', authenticateRequest, createTransfer);

export default router;
