declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    FRONTEND_URL: string;
    CORS_ORIGINS: string;
    BCRYPT_ROUNDS: string;
    LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
    RATE_LIMIT_WINDOW: string;
    RATE_LIMIT_REQUESTS: string;
  }
}