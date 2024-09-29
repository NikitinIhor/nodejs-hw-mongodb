import pino from 'pino-http';

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: true,
    },
  },
});
