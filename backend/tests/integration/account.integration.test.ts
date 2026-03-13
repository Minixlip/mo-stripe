import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client.js';
import { app } from '../../src/app.js';

const TEST_PASSWORD = 'Ledger123!';
const OPENING_BALANCE_PENCE = 500_000;

function assertSafeTestDatabase() {
  const directUrl = process.env.DIRECT_URL ?? '';

  if (process.env.ALLOW_TEST_DB_RESET === 'true') {
    return;
  }

  if (
    directUrl.includes('@localhost:') ||
    directUrl.includes('@127.0.0.1:')
  ) {
    return;
  }

  throw new Error(
    'Integration tests require a disposable database. Point DIRECT_URL to localhost or set ALLOW_TEST_DB_RESET=true.',
  );
}

async function resetDatabase() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "LedgerPosting", "Transaction", "IdempotencyKey", "Account", "User" RESTART IDENTITY CASCADE',
  );
}

async function registerUser(email: string) {
  const agent = request.agent(app);
  const response = await agent.post('/register').send({
    email,
    password: TEST_PASSWORD,
    confirmPassword: TEST_PASSWORD,
  });

  expect(response.status).toBe(201);

  return agent;
}

async function getLedgerBalance(accountId: string) {
  const postingsByDirection = await prisma.ledgerPosting.groupBy({
    by: ['direction'],
    where: { accountId },
    _sum: {
      amount: true,
    },
  });

  return postingsByDirection.reduce((total, posting) => {
    const amount = posting._sum.amount ?? 0;

    return posting.direction === 'CREDIT' ? total + amount : total - amount;
  }, 0);
}

async function getUserAccount(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      account: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user?.account) {
    throw new Error(`Account not found for ${email}`);
  }

  return {
    ...user.account,
    balance: await getLedgerBalance(user.account.id),
  };
}

describe('Account integration flows', () => {
  beforeAll(() => {
    assertSafeTestDatabase();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('rejects account access without an authenticated cookie', async () => {
    const response = await request(app).get('/account');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Authentication required.' });
  });

  it('registers a user with a provisioned account and opening ledger posting', async () => {
    const agent = await registerUser('alice@example.com');
    const account = await getUserAccount('alice@example.com');

    expect(account.balance).toBe(OPENING_BALANCE_PENCE);

    const openingTransactions = await prisma.transaction.findMany({
      where: {
        type: 'DEPOSIT',
        toAccountId: account.id,
      },
      select: {
        amount: true,
        ledgerPostings: {
          select: {
            amount: true,
            direction: true,
            accountId: true,
          },
        },
      },
    });

    expect(openingTransactions).toHaveLength(1);
    expect(openingTransactions[0]).toEqual({
      amount: OPENING_BALANCE_PENCE,
      ledgerPostings: [
        {
          amount: OPENING_BALANCE_PENCE,
          direction: 'CREDIT',
          accountId: account.id,
        },
      ],
    });

    const overview = await agent.get('/account');

    expect(overview.status).toBe(200);
    expect(overview.body.email).toBe('alice@example.com');
    expect(overview.body.account.balance).toBe(OPENING_BALANCE_PENCE);
  });

  it('replays the same deposit once and rejects the same key for a different payload', async () => {
    const agent = await registerUser('alice@example.com');

    const firstDeposit = await agent
      .post('/account/deposit')
      .set('Idempotency-Key', 'deposit-key-0001')
      .send({ amount: '12.34' });

    expect(firstDeposit.status).toBe(201);
    expect(firstDeposit.body.balance).toBe(OPENING_BALANCE_PENCE + 1_234);

    const replayedDeposit = await agent
      .post('/account/deposit')
      .set('Idempotency-Key', 'deposit-key-0001')
      .send({ amount: '12.34' });

    expect(replayedDeposit.status).toBe(201);
    expect(replayedDeposit.headers['idempotency-replayed']).toBe('true');
    expect(replayedDeposit.body.balance).toBe(OPENING_BALANCE_PENCE + 1_234);

    const mismatchedDeposit = await agent
      .post('/account/deposit')
      .set('Idempotency-Key', 'deposit-key-0001')
      .send({ amount: '12.35' });

    expect(mismatchedDeposit.status).toBe(409);
    expect(mismatchedDeposit.body).toEqual({
      error: 'This idempotency key has already been used for a different request.',
    });

    const account = await getUserAccount('alice@example.com');
    const depositTransactions = await prisma.transaction.count({
      where: {
        type: 'DEPOSIT',
        toAccountId: account.id,
      },
    });

    expect(account.balance).toBe(OPENING_BALANCE_PENCE + 1_234);
    expect(depositTransactions).toBe(2);
  });

  it('blocks overdrafts without recording a withdrawal transaction', async () => {
    const agent = await registerUser('alice@example.com');

    const withdrawal = await agent
      .post('/account/withdraw')
      .set('Idempotency-Key', 'withdraw-key-0001')
      .send({ amount: '6000.00' });

    expect(withdrawal.status).toBe(409);
    expect(withdrawal.body).toEqual({ error: 'Insufficient funds.' });

    const account = await getUserAccount('alice@example.com');
    const withdrawals = await prisma.transaction.count({
      where: {
        type: 'WITHDRAWAL',
        fromAccountId: account.id,
      },
    });

    expect(account.balance).toBe(OPENING_BALANCE_PENCE);
    expect(withdrawals).toBe(0);
  });

  it('creates balanced transfer postings, replays safely, and enforces ownership on transaction detail reads', async () => {
    const aliceAgent = await registerUser('alice@example.com');
    const bobAgent = await registerUser('bob@example.com');
    const charlieAgent = await registerUser('charlie@example.com');

    const transfer = await aliceAgent
      .post('/account/transfer')
      .set('Idempotency-Key', 'transfer-key-0001')
      .send({
        amount: '25.00',
        recipientEmail: 'bob@example.com',
      });

    expect(transfer.status).toBe(201);
    expect(transfer.body.balance).toBe(OPENING_BALANCE_PENCE - 2_500);

    const replayedTransfer = await aliceAgent
      .post('/account/transfer')
      .set('Idempotency-Key', 'transfer-key-0001')
      .send({
        amount: '25.00',
        recipientEmail: 'bob@example.com',
      });

    expect(replayedTransfer.status).toBe(201);
    expect(replayedTransfer.headers['idempotency-replayed']).toBe('true');

    const aliceAccount = await getUserAccount('alice@example.com');
    const bobAccount = await getUserAccount('bob@example.com');

    expect(aliceAccount.balance).toBe(OPENING_BALANCE_PENCE - 2_500);
    expect(bobAccount.balance).toBe(OPENING_BALANCE_PENCE + 2_500);

    const transferTransactions = await prisma.transaction.findMany({
      where: {
        type: 'TRANSFER',
      },
      select: {
        id: true,
        amount: true,
        ledgerPostings: {
          orderBy: {
            direction: 'asc',
          },
          select: {
            amount: true,
            direction: true,
            accountId: true,
          },
        },
      },
    });

    expect(transferTransactions).toHaveLength(1);
    expect(transferTransactions[0]).toMatchObject({
      id: transferTransactions[0]?.id,
      amount: 2_500,
    });
    expect(transferTransactions[0]?.ledgerPostings).toHaveLength(2);
    expect(transferTransactions[0]?.ledgerPostings).toEqual(
      expect.arrayContaining([
        {
          amount: 2_500,
          direction: 'CREDIT',
          accountId: bobAccount.id,
        },
        {
          amount: 2_500,
          direction: 'DEBIT',
          accountId: aliceAccount.id,
        },
      ]),
    );

    const transferId = transferTransactions[0]?.id;

    if (!transferId) {
      throw new Error('Transfer transaction was not created.');
    }

    const aliceDetail = await aliceAgent.get(`/account/transactions/${transferId}`);
    const bobDetail = await bobAgent.get(`/account/transactions/${transferId}`);
    const charlieDetail = await charlieAgent.get(`/account/transactions/${transferId}`);

    expect(aliceDetail.status).toBe(200);
    expect(bobDetail.status).toBe(200);
    expect(charlieDetail.status).toBe(404);
    expect(aliceDetail.body.transaction.ledgerPostings).toHaveLength(2);
    expect(bobDetail.body.transaction.ledgerPostings).toHaveLength(2);
  });
});
