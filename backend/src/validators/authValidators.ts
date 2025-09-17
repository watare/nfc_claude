import { body } from 'express-validator';
import { UserRole } from '@prisma/client';

// Validateur pour l'inscription
export const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email trop long'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),

  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets'),

  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'),

  body('role')
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage('Rôle invalide')
];

// Validateur pour la connexion
export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis')
];

// Validateur pour la mise à jour du profil
export const updateProfileValidator = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email trop long'),

  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets')
];

// Validateur pour le changement de mot de passe
export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Mot de passe actuel requis'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('La confirmation du mot de passe ne correspond pas');
      }
      return true;
    })
];