export interface AppErrorOptions {
  statusCode?: number;
  code?: string;
  action?: string;
  details?: Record<string, unknown>;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly action?: string;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code;
    this.action = options.action;
    this.details = options.details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class AuthError extends AppError {}
