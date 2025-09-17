import { body, query } from 'express-validator';
import { EquipmentStatus } from '@prisma/client';

// Validateur pour la création d'équipement
export const createEquipmentValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .matches(/^[a-zA-Z0-9À-ÿ\s\-_.()]+$/)
    .withMessage('Le nom ne peut contenir que des lettres, chiffres, espaces et caractères spéciaux de base'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),

  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La catégorie doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-Z0-9À-ÿ\s\-_]+$/)
    .withMessage('La catégorie ne peut contenir que des lettres, chiffres, espaces et tirets'),

  body('status')
    .optional()
    .isIn(Object.values(EquipmentStatus))
    .withMessage('Statut invalide'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La localisation ne peut pas dépasser 100 caractères'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Les notes ne peuvent pas dépasser 1000 caractères')
];

// Validateur pour la mise à jour d'équipement
export const updateEquipmentValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .matches(/^[a-zA-Z0-9À-ÿ\s\-_.()]+$/)
    .withMessage('Le nom ne peut contenir que des lettres, chiffres, espaces et caractères spéciaux de base'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),

  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La catégorie doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-Z0-9À-ÿ\s\-_]+$/)
    .withMessage('La catégorie ne peut contenir que des lettres, chiffres, espaces et tirets'),

  body('status')
    .optional()
    .isIn(Object.values(EquipmentStatus))
    .withMessage('Statut invalide'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La localisation ne peut pas dépasser 100 caractères'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Les notes ne peuvent pas dépasser 1000 caractères')
];

// Validateur pour l'assignation de tag NFC
export const assignNfcTagValidator = [
  body('tagId')
    .trim()
    .isLength({ min: 4, max: 50 })
    .withMessage('L\'ID du tag doit contenir entre 4 et 50 caractères')
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('L\'ID du tag ne peut contenir que des lettres, chiffres, tirets et underscores')
];

// Validateur pour les paramètres de requête de recherche
export const searchEquipmentsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier positif'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être un entier entre 1 et 100'),

  query('sortBy')
    .optional()
    .isIn(['name', 'createdAt', 'updatedAt', 'category'])
    .withMessage('Le tri doit être par name, createdAt, updatedAt ou category'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('L\'ordre de tri doit être asc ou desc'),

  query('status')
    .optional()
    .isIn(Object.values(EquipmentStatus))
    .withMessage('Statut invalide'),

  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('La catégorie ne peut pas dépasser 50 caractères'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La recherche ne peut pas dépasser 100 caractères'),

  query('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La localisation ne peut pas dépasser 100 caractères')
];