import { Router } from 'express';
import { authRoutes } from './authRoutes';

const router = Router();

// Routes d'authentification
router.use('/auth', authRoutes);

// Autres routes à ajouter dans les phases suivantes
// router.use('/equipments', equipmentRoutes); // Phase 5
// router.use('/nfc', nfcRoutes); // Phase 8

export { router as apiRoutes };