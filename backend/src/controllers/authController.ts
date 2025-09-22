import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/authService';
import { logger } from '../utils/logger';

export class AuthController {
  // Inscription d'un nouvel utilisateur
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // Vérification des erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Erreurs de validation lors de l\'inscription:', {
          errors: errors.array(),
          body: { ...req.body, password: '[HIDDEN]' }
        });
        res.status(400).json({
          error: 'Données invalides',
          details: errors.array()
        });
        return;
      }

      const { email, password, firstName, lastName, role } = req.body;

      const result = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
        role
      });

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        data: result
      });
    } catch (error) {
      logger.error('Erreur dans register controller:', error);

      if (error instanceof Error) {
        if (error.message.includes('existe déjà')) {
          res.status(409).json({ error: error.message });
        } else if (error.message.includes('mot de passe')) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
      }
    }
  }

  // Connexion d'un utilisateur
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // Vérification des erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Données invalides',
          details: errors.array()
        });
        return;
      }

      const { email, password } = req.body;

      const result = await AuthService.login({ email, password });

      res.json({
        message: 'Connexion réussie',
        data: result
      });
    } catch (error) {
      logger.error('Erreur dans login controller:', error);

      if (error instanceof Error) {
        if (error.message.includes('incorrect') || error.message.includes('désactivé')) {
          res.status(401).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
      }
    }
  }

  // Récupération du profil utilisateur courant
  static async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentification requise' });
        return;
      }

      const profile = await AuthService.getProfile(req.user.id);

      res.json({
        message: 'Profil récupéré avec succès',
        data: profile
      });
    } catch (error) {
      logger.error('Erreur dans getMe controller:', error);

      if (error instanceof Error && error.message.includes('non trouvé')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erreur serveur lors de la récupération du profil' });
      }
    }
  }

  // Mise à jour du profil utilisateur
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentification requise' });
        return;
      }

      // Vérification des erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Données invalides',
          details: errors.array()
        });
        return;
      }

      const { firstName, lastName, email } = req.body;

      const updatedUser = await AuthService.updateProfile(req.user.id, {
        firstName,
        lastName,
        email
      });

      res.json({
        message: 'Profil mis à jour avec succès',
        data: updatedUser
      });
    } catch (error) {
      logger.error('Erreur dans updateProfile controller:', error);

      if (error instanceof Error) {
        if (error.message.includes('existe déjà')) {
          res.status(409).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du profil' });
      }
    }
  }

  // Changement de mot de passe
  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentification requise' });
        return;
      }

      // Vérification des erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Données invalides',
          details: errors.array()
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      await AuthService.changePassword(req.user.id, currentPassword, newPassword);

      res.json({
        message: 'Mot de passe changé avec succès'
      });
    } catch (error) {
      logger.error('Erreur dans changePassword controller:', error);

      if (error instanceof Error) {
        if (error.message.includes('incorrect')) {
          res.status(400).json({ error: error.message });
        } else if (error.message.includes('caractères')) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Erreur serveur lors du changement de mot de passe' });
      }
    }
  }

  // Déconnexion (côté client principalement)
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // Dans une implémentation JWT stateless, la déconnexion est gérée côté client
      // En supprimant le token du stockage local/sessionStorage

      // Ici on peut logger la déconnexion pour audit
      if (req.user) {
        logger.info(`Utilisateur déconnecté: ${req.user.email}`);
      }

      res.json({
        message: 'Déconnexion réussie'
      });
    } catch (error) {
      logger.error('Erreur dans logout controller:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la déconnexion' });
    }
  }
}