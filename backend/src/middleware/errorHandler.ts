import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const createAppError = (message: string, statusCode: number): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message } = error;

  // Log error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Données de validation invalides';
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token JWT invalide';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token JWT expiré';
  }

  // Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Erreur de base de données';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && !error.isOperational) {
    message = 'Erreur interne du serveur';
  }

  res.status(statusCode).json({
    error: true,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      originalError: error.message
    })
  });
};