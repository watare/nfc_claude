import { logger } from '../utils/logger';

interface PasswordResetEmailPayload {
  to: string;
  token: string;
  resetLink: string;
  expiresAt: Date;
  firstName?: string | null;
  lastName?: string | null;
}

export class EmailService {
  private static readonly instance = new EmailService();
  private readonly isEnabled: boolean;
  private readonly fromAddress: string;

  private constructor() {
    this.isEnabled = process.env.EMAIL_ENABLED === 'true';
    this.fromAddress = process.env.EMAIL_FROM ?? 'no-reply@nfc-manager.local';
  }

  static getInstance(): EmailService {
    return this.instance;
  }

  async sendPasswordResetEmail(payload: PasswordResetEmailPayload): Promise<void> {
    const { to, token, resetLink, expiresAt, firstName, lastName } = payload;

    if (!this.isEnabled) {
      logger.info('[EmailService] Envoi simulé de l\'email de réinitialisation de mot de passe', {
        to,
        token,
        resetLink,
        expiresAt: expiresAt.toISOString(),
      });
      return;
    }

    // Placeholder pour une future implémentation SMTP réelle
    logger.warn('EmailService configuré en mode "enabled" mais aucune implémentation SMTP n\'est fournie.', {
      to,
      from: this.fromAddress,
      resetLink,
      expiresAt: expiresAt.toISOString(),
      firstName,
      lastName,
    });
  }
}
