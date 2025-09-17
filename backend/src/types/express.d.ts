import { UserRole } from '@prisma/client';
import * as core from 'express-serve-static-core';

// Extension des types Express pour inclure nos types personnalisés
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
      rateLimit?: {
        limit: number;
        current: number;
        remaining: number;
        resetTime?: Date;
      };
    }
  }
}

// Extension du namespace Express pour les types de rate limiting
declare module 'express-serve-static-core' {
  interface Request {
    rateLimit?: {
      limit: number;
      current: number;
      remaining: number;
      resetTime?: Date;
    };
  }
}