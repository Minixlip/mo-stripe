type LogLevel = 'info' | 'warn' | 'error';

type LogFields = Record<string, unknown>;

function write(level: LogLevel, entry: LogFields) {
  const payload = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    ...entry,
  });

  if (level === 'error') {
    console.error(payload);
    return;
  }

  console.log(payload);
}

export function logInfo(event: string, fields: LogFields = {}) {
  write('info', { event, ...fields });
}

export function logWarn(event: string, fields: LogFields = {}) {
  write('warn', { event, ...fields });
}

export function logError(event: string, fields: LogFields = {}) {
  write('error', { event, ...fields });
}
