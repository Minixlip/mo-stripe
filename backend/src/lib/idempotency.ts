import { createHash } from 'node:crypto';
import type { Request } from 'express';

const IDEMPOTENCY_KEY_MIN_LENGTH = 8;
const IDEMPOTENCY_KEY_MAX_LENGTH = 255;

type IdempotencyKeyResult =
  | {
      success: true;
      key: string;
    }
  | {
      success: false;
      message: string;
    };

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) =>
    left.localeCompare(right),
  );

  return `{${entries
    .map(([key, entryValue]) => `${JSON.stringify(key)}:${stableStringify(entryValue)}`)
    .join(',')}}`;
}

export function getIdempotencyKeyFromRequest(req: Request): IdempotencyKeyResult {
  const rawValue = req.get('Idempotency-Key');

  if (!rawValue) {
    return {
      success: false,
      message: 'Idempotency-Key header is required for financial writes.',
    };
  }

  const key = rawValue.trim();

  if (
    key.length < IDEMPOTENCY_KEY_MIN_LENGTH ||
    key.length > IDEMPOTENCY_KEY_MAX_LENGTH
  ) {
    return {
      success: false,
      message: `Idempotency-Key header must be between ${IDEMPOTENCY_KEY_MIN_LENGTH} and ${IDEMPOTENCY_KEY_MAX_LENGTH} characters.`,
    };
  }

  return {
    success: true,
    key,
  };
}

export function createIdempotencyRequestHash(
  operation: string,
  payload: unknown,
) {
  return createHash('sha256')
    .update(stableStringify({ operation, payload }))
    .digest('hex');
}
