import crypto from 'crypto';
import { EmailService } from './emailService';
import { logger } from '../utils/logger';

type ResetRequest = {
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  resetLink: string;
};

const pendingRequests = new Map<string, ResetRequest>();

const RESET_EXPIRATION_MINUTES = parseInt(
  process.env.PASSWORD_RESET_EXPIRATION_MINUTES ?? '30',
  10
);

export class PasswordResetService {
  static async createResetRequest(user: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  }): Promise<ResetRequest> {
    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + RESET_EXPIRATION_MINUTES * 60 * 1000);
    const appUrl = process.env.APP_URL ?? 'http://localhost:5173';
    const resetLink = `${appUrl.replace(/\/$/, '')}/reset-password?token=${token}`;

    const request: ResetRequest = {
      userId: user.id,
      email: user.email,
      token,
      expiresAt,
      resetLink,
    };

    pendingRequests.set(token, request);

    await EmailService.getInstance().sendPasswordResetEmail({
      to: user.email,
      token,
      resetLink,
      expiresAt,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    logger.info('Lien de réinitialisation généré', {
      userId: user.id,
      email: user.email,
      expiresAt: expiresAt.toISOString(),
    });

    return request;
  }

  static consumeToken(token: string): ResetRequest | null {
    const request = pendingRequests.get(token);
    if (!request) {
      return null;
    }

    if (request.expiresAt.getTime() < Date.now()) {
      pendingRequests.delete(token);
      return null;
    }

    pendingRequests.delete(token);
    return request;
  }

  static getDebugRequest(token: string): ResetRequest | null {
    return pendingRequests.get(token) ?? null;
  }
}
