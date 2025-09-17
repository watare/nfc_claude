import { Router } from 'express';
import { EquipmentController } from '../controllers/equipmentController';
import {
  authenticateToken,
  requireAuth,
  requireAdmin
} from '../middleware/auth';
import {
  createEquipmentValidator,
  updateEquipmentValidator,
  assignNfcTagValidator,
  searchEquipmentsValidator
} from '../validators/equipmentValidators';

const router = Router();

/**
 * @route GET /api/equipments
 * @desc Récupérer la liste des équipements avec filtres et pagination
 * @access Private
 */
router.get('/',
  authenticateToken,
  requireAuth,
  searchEquipmentsValidator,
  EquipmentController.getEquipments
);

/**
 * @route POST /api/equipments
 * @desc Créer un nouvel équipement
 * @access Private
 */
router.post('/',
  authenticateToken,
  requireAuth,
  createEquipmentValidator,
  EquipmentController.createEquipment
);

/**
 * @route GET /api/equipments/statistics
 * @desc Récupérer les statistiques des équipements
 * @access Private
 */
router.get('/statistics',
  authenticateToken,
  requireAuth,
  EquipmentController.getStatistics
);

/**
 * @route GET /api/equipments/export
 * @desc Exporter les équipements en CSV
 * @access Private
 */
router.get('/export',
  authenticateToken,
  requireAuth,
  EquipmentController.exportEquipments
);

/**
 * @route GET /api/equipments/:id
 * @desc Récupérer un équipement par ID
 * @access Private
 */
router.get('/:id',
  authenticateToken,
  requireAuth,
  EquipmentController.getEquipmentById
);

/**
 * @route PUT /api/equipments/:id
 * @desc Mettre à jour un équipement
 * @access Private
 */
router.put('/:id',
  authenticateToken,
  requireAuth,
  updateEquipmentValidator,
  EquipmentController.updateEquipment
);

/**
 * @route DELETE /api/equipments/:id
 * @desc Supprimer un équipement
 * @access Private (Admin ou créateur)
 */
router.delete('/:id',
  authenticateToken,
  requireAuth, // Pour l'instant tous les utilisateurs peuvent supprimer
  EquipmentController.deleteEquipment
);

/**
 * @route POST /api/equipments/:id/nfc-tag
 * @desc Assigner un tag NFC à un équipement
 * @access Private
 */
router.post('/:id/nfc-tag',
  authenticateToken,
  requireAuth,
  assignNfcTagValidator,
  EquipmentController.assignNfcTag
);

/**
 * @route DELETE /api/equipments/:id/nfc-tag
 * @desc Retirer un tag NFC d'un équipement
 * @access Private
 */
router.delete('/:id/nfc-tag',
  authenticateToken,
  requireAuth,
  EquipmentController.removeNfcTag
);

export { router as equipmentRoutes };