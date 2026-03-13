import { Router } from 'express';
import { createDeposit } from '../controllers/CreateDeposit.js';
import { getAccountMonthlyStatementController } from '../controllers/GetAccountMonthlyStatement.js';
import { getAccountTransactionController } from '../controllers/GetAccountTransaction.js';
import { getAccountTransactionsController } from '../controllers/GetAccountTransactions.js';
import { createTransfer } from '../controllers/CreateTransfer.js';
import { createWithdrawal } from '../controllers/CreateWithdrawal.js';
import { getAccount } from '../controllers/GetAccount.js';
import { authenticateRequest } from '../middleware/auth.middleware.js';
import {
  moneyWriteRateLimiter,
  statementRateLimiter,
} from '../middleware/rateLimit.middleware.js';

const router = Router();

router.get('/', authenticateRequest, getAccount);
router.get(
  '/statements/monthly',
  authenticateRequest,
  statementRateLimiter,
  getAccountMonthlyStatementController,
);
router.get('/transactions', authenticateRequest, getAccountTransactionsController);
router.get(
  '/transactions/:transactionId',
  authenticateRequest,
  getAccountTransactionController,
);
router.post('/deposit', authenticateRequest, moneyWriteRateLimiter, createDeposit);
router.post(
  '/withdraw',
  authenticateRequest,
  moneyWriteRateLimiter,
  createWithdrawal,
);
router.post(
  '/transfer',
  authenticateRequest,
  moneyWriteRateLimiter,
  createTransfer,
);

export default router;
