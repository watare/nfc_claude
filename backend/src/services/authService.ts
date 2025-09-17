import bcrypt from 'bcryptjs';
import { PrismaClient, User, UserRole } from '@prisma/client';
import { generateToken } from '../middleware/auth';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Interface pour les données d'inscription
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

// Interface pour les données de connexion
export interface LoginData {
  email: string;
  password: string;
}

// Interface pour la réponse d'authentification
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
  };
  token: string;
}

export class AuthService {
  // Inscription d'un nouvel utilisateur
  static async register(data: RegisterData): Promise<AuthResponse> {
    const { email, password, firstName, lastName, role = UserRole.USER } = data;

    try {
      // Vérification si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      // Validation du mot de passe
      if (password.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }

      // Hash du mot de passe
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Création de l'utilisateur
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName,
          lastName,
          role
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true
        }
      });

      // Génération du token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      logger.info(`Nouvel utilisateur créé: ${user.email}`);

      return {
        user,
        token
      };
    } catch (error) {
      logger.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  // Connexion d'un utilisateur
  static async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    try {
      // Recherche de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Vérification si l'utilisateur est actif
      if (!user.isActive) {
        throw new Error('Compte utilisateur désactivé');
      }

      // Vérification du mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Génération du token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      logger.info(`Utilisateur connecté: ${user.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive
        },
        token
      };
    } catch (error) {
      logger.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  // Récupération du profil utilisateur
  static async getProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              equipmentsCreated: true,
              events: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      return user;
    } catch (error) {
      logger.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }

  // Mise à jour du profil utilisateur
  static async updateProfile(
    userId: string,
    data: Partial<Pick<User, 'firstName' | 'lastName' | 'email'>>
  ) {
    try {
      // Si l'email est modifié, vérifier qu'il n'existe pas déjà
      if (data.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: data.email.toLowerCase() }
        });

        if (existingUser && existingUser.id !== userId) {
          throw new Error('Un utilisateur avec cet email existe déjà');
        }
      }

      // Préparation des données à mettre à jour
      const updateData: any = {};
      if (data.firstName !== undefined) updateData.firstName = data.firstName;
      if (data.lastName !== undefined) updateData.lastName = data.lastName;
      if (data.email !== undefined) updateData.email = data.email.toLowerCase();

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          updatedAt: true
        }
      });

      logger.info(`Profil utilisateur mis à jour: ${updatedUser.email}`);

      return updatedUser;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  }

  // Changement de mot de passe
  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      // Récupération de l'utilisateur avec le mot de passe
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérification du mot de passe actuel
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Mot de passe actuel incorrect');
      }

      // Validation du nouveau mot de passe
      if (newPassword.length < 8) {
        throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      }

      // Hash du nouveau mot de passe
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Mise à jour du mot de passe
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });

      logger.info(`Mot de passe changé pour l'utilisateur: ${user.email}`);

      return { success: true };
    } catch (error) {
      logger.error('Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  }
}