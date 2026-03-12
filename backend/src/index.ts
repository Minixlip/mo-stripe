import 'dotenv/config';
import { prisma } from '../prisma/client.js';
import { logError, logInfo } from './lib/logger.js';
import { app } from './app.js';

const PORT = Number(process.env.PORT ?? 4000);

const server = app.listen(PORT, () => {
  logInfo('server_started', {
    port: PORT,
    nodeEnv: process.env.NODE_ENV ?? 'development',
  });
});

async function shutdown(signal: string) {
  logInfo('server_shutdown_requested', { signal });

  server.close(async () => {
    await prisma.$disconnect();
    logInfo('server_stopped', { signal });
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('unhandledRejection', (reason) => {
  logError('unhandled_rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack:
      reason instanceof Error && process.env.NODE_ENV !== 'production'
        ? reason.stack
        : undefined,
  });
});

process.on('uncaughtException', (error) => {
  logError('uncaught_exception', {
    error: error.message,
    stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
  });
});
