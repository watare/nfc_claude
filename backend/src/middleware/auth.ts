import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Interface pour le payload JWT
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Les types sont maintenant définis dans src/types/express.d.ts

// Middleware d'authentification JWT
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Token d\'accès requis' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logger.error('JWT_SECRET non défini dans les variables d\'environnement');
      res.status(500).json({ error: 'Erreur de configuration serveur' });
      return;
    }

    // Vérification du token
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Vérification que l'utilisateur existe toujours et est actif
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Token invalide ou utilisateur inactif' });
      return;
    }

    // Ajout des infos utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    logger.error('Erreur authentification:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Token invalide' });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expiré' });
    } else {
      res.status(500).json({ error: 'Erreur serveur lors de l\'authentification' });
    }
  }
};

// Middleware d'autorisation par rôle
export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentification requise' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Permissions insuffisantes' });
      return;
    }

    next();
  };
};

// Middleware pour admin seulement
export const requireAdmin = requireRole([UserRole.ADMIN]);

// Middleware pour utilisateur connecté ou admin
export const requireAuth = requireRole([UserRole.USER, UserRole.ADMIN]);

// Fonction utilitaire pour générer un token JWT
export const generateToken = (user: { id: string; email: string; role: UserRole }): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET non défini');
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};