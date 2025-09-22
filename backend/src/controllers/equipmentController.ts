import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { EquipmentService, EquipmentFilters, PaginationOptions } from '../services/equipmentService';
import { logger } from '../utils/logger';

export class EquipmentController {
  // Créer un nouvel équipement
  static async createEquipment(req: Request, res: Response): Promise<void> {
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

      if (!req.user) {
        res.status(401).json({ error: 'Authentification requise' });
        return;
      }

      const { name, description, category, status, location, notes } = req.body;

      const equipment = await EquipmentService.createEquipment({
        name,
        description,
        category,
        status,
        location,
        notes
      }, req.user.id);

      res.status(201).json(equipment);
    } catch (error) {
      logger.error('Erreur dans createEquipment controller:', error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erreur serveur lors de la création de l\'équipement' });
      }
    }
  }

  // Récupérer la liste des équipements avec filtres et pagination
  static async getEquipments(req: Request, res: Response): Promise<void> {
    try {
      // Extraction des paramètres de requête
      const filters: EquipmentFilters = {
        category: req.query['category'] as string,
        status: req.query['status'] as any,
        search: req.query['search'] as string,
        location: req.query['location'] as string
      };

      const options: PaginationOptions = {
        page: req.query['page'] ? parseInt(req.query['page'] as string) : 1,
        limit: req.query['limit'] ? parseInt(req.query['limit'] as string) : 20,
        sortBy: req.query['sortBy'] as any || 'createdAt',
        sortOrder: req.query['sortOrder'] as 'asc' | 'desc' || 'desc'
      };

      // Validation des paramètres
      if (options.page && options.page < 1) options.page = 1;
      if (options.limit && (options.limit < 1 || options.limit > 100)) options.limit = 20;

      const result = await EquipmentService.getEquipments(filters, options);

      res.json(result);
    } catch (error) {
      logger.error('Erreur dans getEquipments controller:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des équipements' });
    }
  }

  // Récupérer un équipement par ID
  static async getEquipmentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID d\'équipement requis' });
        return;
      }

      const equipment = await EquipmentService.getEquipmentById(id);

      res.json(equipment);
    } catch (error) {
      logger.error('Erreur dans getEquipmentById controller:', error);

      if (error instanceof Error && error.message.includes('non trouvé')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'équipement' });
      }
    }
  }

  // Mettre à jour un équipement
  static async updateEquipment(req: Request, res: Response): Promise<void> {
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

      if (!req.user) {
        res.status(401).json({ error: 'Authentification requise' });
        return;
      }

      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID d\'équipement requis' });
        return;
      }

      const { name, description, category, status, location, notes } = req.body;

      const equipment = await EquipmentService.updateEquipment(id, {
        name,
        description,
        category,
        status,
        location,
        notes
      }, req.user.id);

      res.json(equipment);
    } catch (error) {
      logger.error('Erreur dans updateEquipment controller:', error);

      if (error instanceof Error) {
        if (error.message.includes('non trouvé')) {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'équipement' });
      }
    }
  }

  // Supprimer un équipement
  static async deleteEquipment(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentification requise' });
        return;
      }

      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID d\'équipement requis' });
        return;
      }

      const result = await EquipmentService.deleteEquipment(id, req.user.id);

      res.json(result);
    } catch (error) {
      logger.error('Erreur dans deleteEquipment controller:', error);

      if (error instanceof Error) {
        if (error.message.includes('non trouvé')) {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'équipement' });
      }
    }
  }

  // Assigner un tag NFC à un équipement
  static async assignNfcTag(req: Request, res: Response): Promise<void> {
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

      if (!req.user) {
        res.status(401).json({ error: 'Authentification requise' });
        return;
      }

      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID d\'équipement requis' });
        return;
      }

      const { tagId } = req.body;

      const equipment = await EquipmentService.assignNfcTag(id, tagId, req.user.id);

      res.json(equipment);
    } catch (error) {
      logger.error('Erreur dans assignNfcTag controller:', error);

      if (error instanceof Error) {
        if (error.message.includes('non trouvé')) {
          res.status(404).json({ error: error.message });
        } else if (error.message.includes('déjà assigné')) {
          res.status(409).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Erreur serveur lors de l\'assignation du tag' });
      }
    }
  }

  // Retirer un tag NFC d'un équipement
  static async removeNfcTag(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentification requise' });
        return;
      }

      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID d\'équipement requis' });
        return;
      }

      const equipment = await EquipmentService.removeNfcTag(id, req.user.id);

      res.json(equipment);
    } catch (error) {
      logger.error('Erreur dans removeNfcTag controller:', error);

      if (error instanceof Error) {
        if (error.message.includes('non trouvé')) {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Erreur serveur lors de la suppression du tag' });
      }
    }
  }

  // Récupérer les statistiques des équipements
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await EquipmentService.getStatistics();

      res.json(statistics);
    } catch (error) {
      logger.error('Erreur dans getStatistics controller:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques' });
    }
  }

  // Exporter les équipements en CSV
  static async exportEquipments(req: Request, res: Response): Promise<void> {
    try {
      // Récupérer tous les équipements (sans pagination)
      const result = await EquipmentService.getEquipments({}, { limit: 10000 });
      const equipments = result.equipments;

      // Générer le contenu CSV
      const csvHeader = 'ID,Nom,Description,Catégorie,Statut,Localisation,Notes,Créateur,Date de création,Tag NFC\n';

      const csvRows = equipments.map(equipment => {
        const row = [
          equipment.id,
          `"${equipment.name.replace(/"/g, '""')}"`,
          `"${(equipment.description || '').replace(/"/g, '""')}"`,
          `"${equipment.category.replace(/"/g, '""')}"`,
          equipment.status,
          `"${(equipment.location || '').replace(/"/g, '""')}"`,
          `"${(equipment.notes || '').replace(/"/g, '""')}"`,
          `"${equipment.creator.firstName} ${equipment.creator.lastName}"`,
          equipment.createdAt.toISOString().split('T')[0],
          equipment.tag?.tagId || ''
        ];
        return row.join(',');
      });

      const csvContent = csvHeader + csvRows.join('\n');

      // Configuration des headers pour le téléchargement
      const timestamp = new Date().toISOString().split('T')[0];
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="equipments_export_${timestamp}.csv"`);
      res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8'));

      res.send(csvContent);
    } catch (error) {
      logger.error('Erreur dans exportEquipments controller:', error);
      res.status(500).json({ error: 'Erreur serveur lors de l\'export des équipements' });
    }
  }
}