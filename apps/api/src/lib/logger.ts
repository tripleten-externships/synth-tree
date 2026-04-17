import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

// Centralized Pino logger used across the API.
// Pretty-print logs in development; structured JSON logs in production.
// Sensitive fields are automatically redacted to avoid leaking credentials/tokens.
const logger = pino({
  // Default to DEBUG in development, INFO in production unless overridden
  level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),

  // Human-readable logs in development for easier debugging
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname', // Reduce noise in local logs
      },
    },
  }),

  // Redact sensitive fields from logs to prevent leaking secrets or tokens
  redact: {
    paths: [
      '*.password',
      '*.token',
      '*.accessToken',
      '*.refreshToken',
      '*.secret',
      'variables.password',
      'variables.token',
      'headers.authorization', // Prevent logging raw JWTs
    ],
    censor: '[REDACTED]',
  },
});

export default logger;