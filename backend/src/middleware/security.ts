import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Configuration Helmet pour les headers de sécurité
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Rate limiting général
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_REQUESTS || '100'), // limite par IP
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Trop de requêtes, veuillez réessayer plus tard',
      retryAfter: req.rateLimit?.resetTime
    });
  }
});

// Rate limiting strict pour l'authentification
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // maximum 5 tentatives de connexion par IP
  message: {
    error: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne compte que les tentatives échouées
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes',
      retryAfter: req.rateLimit?.resetTime
    });
  }
});

// Rate limiting pour l'inscription
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // maximum 3 inscriptions par IP par heure
  message: {
    error: 'Trop d\'inscriptions, veuillez réessayer dans 1 heure',
    retryAfter: '1 heure'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Trop d\'inscriptions, veuillez réessayer dans 1 heure',
      retryAfter: req.rateLimit?.resetTime
    });
  }
});

// Middleware de validation des headers de sécurité
export const validateSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Vérification de l'origine en production
  if (process.env.NODE_ENV === 'production') {
    const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [];
    const origin = req.headers.origin;

    if (origin && !allowedOrigins.includes(origin)) {
      res.status(403).json({ error: 'Origine non autorisée' });
      return;
    }
  }

  // Headers de sécurité supplémentaires
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // HSTS en production avec HTTPS
  if (process.env.NODE_ENV === 'production' && req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};

// Middleware de détection des tentatives de scan/attaque
export const detectScanAttempts = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPaths = [
    '/admin', '/wp-admin', '/phpmyadmin', '/.env', '/config',
    '/backup', '/test', '/debug', '/api/v1/admin', '/.git'
  ];

  const path = req.path.toLowerCase();
  const isSuspicious = suspiciousPaths.some(suspPath => path.includes(suspPath));

  if (isSuspicious) {
    // Log de l'tentative suspecte
    console.warn(`Tentative d'accès suspect: ${req.ip} -> ${req.path}`);

    res.status(404).json({ error: 'Ressource non trouvée' });
    return;
  }

  next();
};

// Middleware de nettoyage des données d'entrée
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Fonction de nettoyage basique
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      // Suppression des caractères potentiellement dangereux
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }

    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    }

    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }

  if (req.query) {
    req.query = sanitize(req.query);
  }

  next();
};