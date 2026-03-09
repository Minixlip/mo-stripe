import type { ZodError } from 'zod';

export function formatValidationError(error: ZodError) {
  return error.issues[0]?.message ?? 'Invalid request payload.';
}
