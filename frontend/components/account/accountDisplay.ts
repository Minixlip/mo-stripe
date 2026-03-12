import type {
  AccountActivityEntry,
  AccountTransactionDetail,
} from '@/lib/account/account';

const gbpFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

export const compactDateFormatter = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const longDateFormatter = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});

export const detailedDateFormatter = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatCurrencyFromPence(amount: number) {
  return gbpFormatter.format(amount / 100);
}

export function formatSignedCurrencyFromPence(amount: number, incoming: boolean) {
  return `${incoming ? '+' : '-'} ${formatCurrencyFromPence(amount)}`;
}

export function formatNetCurrencyFromPence(amount: number) {
  return `${amount >= 0 ? '+' : '-'} ${formatCurrencyFromPence(Math.abs(amount))}`;
}

export function maskAccountId(id: string | null) {
  if (!id) {
    return 'external';
  }

  return `*${id.slice(-4).toUpperCase()}`;
}

export function getEntryLabel(
  item: AccountActivityEntry | AccountTransactionDetail,
) {
  if (item.type === 'DEPOSIT' && item.systemGenerated) {
    return 'OPENING_DEPOSIT';
  }

  if (item.type === 'WITHDRAWAL') {
    return 'CASH_OUT';
  }

  if (item.type === 'TRANSFER') {
    return item.incoming ? 'TRANSFER_IN' : 'TRANSFER_OUT';
  }

  return 'DEPOSIT';
}

export function getEntrySummary(
  item: AccountActivityEntry | AccountTransactionDetail,
) {
  if (item.type === 'DEPOSIT' && item.systemGenerated) {
    return 'Bootstrap credit posted during registration.';
  }

  if (item.type === 'WITHDRAWAL') {
    return 'Funds debited from your personal ledger.';
  }

  if (item.type === 'TRANSFER') {
    return item.incoming
      ? 'Atomic transfer received from another registered user.'
      : 'Atomic transfer sent to another registered user.';
  }

  return 'Funds credited to your personal ledger.';
}
