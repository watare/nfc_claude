import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import {
  authenticateToken,
  requireAdmin,
  requireAuth
} from '../middleware/auth';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator
} from '../validators/authValidators';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Inscription d'un nouvel utilisateur
 * @access Public
 */
router.post('/register', registerValidator, AuthController.register);

/**
 * @route POST /api/auth/login
 * @desc Connexion d'un utilisateur
 * @access Public
 */
router.post('/login', loginValidator, AuthController.login);

/**
 * @route POST /api/auth/logout
 * @desc Déconnexion d'un utilisateur
 * @access Private
 */
router.post('/logout', authenticateToken, AuthController.logout);

/**
 * @route GET /api/auth/me
 * @desc Récupération du profil utilisateur courant
 * @access Private
 */
router.get('/me', authenticateToken, requireAuth, AuthController.getMe);

/**
 * @route PUT /api/auth/me
 * @desc Mise à jour du profil utilisateur
 * @access Private
 */
router.put('/me',
  authenticateToken,
  requireAuth,
  updateProfileValidator,
  AuthController.updateProfile
);

/**
 * @route POST /api/auth/change-password
 * @desc Changement du mot de passe
 * @access Private
 */
router.post('/change-password',
  authenticateToken,
  requireAuth,
  changePasswordValidator,
  AuthController.changePassword
);

export { router as authRoutes };