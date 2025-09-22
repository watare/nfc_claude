import { PrismaClient, Equipment, EquipmentStatus, EventType } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

const equipmentInclude = {
  creator: {
    select: { id: true, firstName: true, lastName: true, email: true }
  },
  tag: {
    select: { id: true, tagId: true, isActive: true, createdAt: true, updatedAt: true }
  },
  _count: {
    select: { events: true }
  }
} as const;

// Interface pour les données de création d'équipement
export interface CreateEquipmentData {
  name: string;
  description?: string;
  category: string;
  status?: EquipmentStatus;
  location?: string;
  notes?: string;
}

// Interface pour les données de mise à jour
export interface UpdateEquipmentData {
  name?: string;
  description?: string;
  category?: string;
  status?: EquipmentStatus;
  location?: string;
  notes?: string;
}

// Interface pour les filtres de recherche
export interface EquipmentFilters {
  category?: string;
  status?: EquipmentStatus;
  search?: string; // Recherche dans nom, description
  location?: string;
}

// Interface pour la pagination
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'category';
  sortOrder?: 'asc' | 'desc';
}

export class EquipmentService {
  // Création d'un nouvel équipement
  static async createEquipment(data: CreateEquipmentData, createdBy: string) {
    try {
      const equipment = await prisma.equipment.create({
        data: {
          ...data,
          createdBy
        },
        include: equipmentInclude
      });

      // Créer un événement de création
      await prisma.equipmentEvent.create({
        data: {
          equipmentId: equipment.id,
          type: EventType.STATUS_CHANGE,
          description: `Équipement créé avec le statut: ${equipment.status}`,
          userId: createdBy,
          metadata: {
            previousStatus: null,
            newStatus: equipment.status,
            action: 'create'
          }
        }
      });

      logger.info(`Équipement créé: ${equipment.name} par ${equipment.creator.email}`);

      return equipment;
    } catch (error) {
      logger.error('Erreur lors de la création de l\'équipement:', error);
      throw error;
    }
  }

  // Récupération d'équipements avec filtres et pagination
  static async getEquipments(filters: EquipmentFilters = {}, options: PaginationOptions = {}) {
    try {
      const {
        category,
        status,
        search,
        location
      } = filters;

      const {
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      // Construction des conditions WHERE
      const where: any = {};

      if (category) where.category = category;
      if (status) where.status = status;
      if (location) where.location = { contains: location, mode: 'insensitive' };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Calcul de la pagination
      const skip = (page - 1) * limit;

      // Construction de l'ordre de tri
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;

      // Requête des équipements
      const [equipments, totalCount] = await Promise.all([
        prisma.equipment.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: equipmentInclude
        }),
        prisma.equipment.count({ where })
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        equipments,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération des équipements:', error);
      throw error;
    }
  }

  // Récupération d'un équipement par ID
  static async getEquipmentById(id: string) {
    try {
      const equipment = await prisma.equipment.findUnique({
        where: { id },
        include: {
          creator: {
            select: { id: true, firstName: true, lastName: true, email: true }
          },
          tag: {
            select: { id: true, tagId: true, isActive: true, createdAt: true }
          },
          events: {
            orderBy: { createdAt: 'desc' },
            take: 50, // Derniers 50 événements
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true, email: true }
              }
            }
          },
          _count: {
            select: { events: true }
          }
        }
      });

      if (!equipment) {
        throw new Error('Équipement non trouvé');
      }

      return equipment;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'équipement:', error);
      throw error;
    }
  }

  // Mise à jour d'un équipement
  static async updateEquipment(id: string, data: UpdateEquipmentData, updatedBy: string) {
    try {
      // Récupérer l'équipement actuel pour comparaison
      const currentEquipment = await prisma.equipment.findUnique({
        where: { id }
      });

      if (!currentEquipment) {
        throw new Error('Équipement non trouvé');
      }

      // Mise à jour de l'équipement
      const updatedEquipment = await prisma.equipment.update({
        where: { id },
        data,
        include: equipmentInclude
      });

      // Créer des événements pour les changements significatifs
      const events: any[] = [];

      // Changement de statut
      if (data.status && data.status !== currentEquipment.status) {
        events.push({
          equipmentId: id,
          type: EventType.STATUS_CHANGE,
          description: `Statut changé de ${currentEquipment.status} vers ${data.status}`,
          userId: updatedBy,
          metadata: {
            previousStatus: currentEquipment.status,
            newStatus: data.status,
            action: 'status_update'
          }
        });
      }

      // Changement de localisation
      if (data.location && data.location !== currentEquipment.location) {
        events.push({
          equipmentId: id,
          type: EventType.STATUS_CHANGE,
          description: `Localisation changée: ${currentEquipment.location || 'Non définie'} → ${data.location}`,
          userId: updatedBy,
          metadata: {
            previousLocation: currentEquipment.location,
            newLocation: data.location,
            action: 'location_update'
          }
        });
      }

      // Enregistrer tous les événements
      if (events.length > 0) {
        await prisma.equipmentEvent.createMany({
          data: events
        });
      }

      logger.info(`Équipement mis à jour: ${updatedEquipment.name} par ${updatedBy}`);

      return updatedEquipment;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de l\'équipement:', error);
      throw error;
    }
  }

  // Suppression d'un équipement
  static async deleteEquipment(id: string, deletedBy: string) {
    try {
      const equipment = await prisma.equipment.findUnique({
        where: { id },
        include: { tag: true }
      });

      if (!equipment) {
        throw new Error('Équipement non trouvé');
      }

      // Créer un événement de suppression avant la suppression
      await prisma.equipmentEvent.create({
        data: {
          equipmentId: id,
          type: EventType.STATUS_CHANGE,
          description: 'Équipement supprimé',
          userId: deletedBy,
          metadata: {
            action: 'delete',
            equipmentName: equipment.name,
            hadTag: !!equipment.tag
          }
        }
      });

      // Suppression de l'équipement (cascade sur les événements)
      await prisma.equipment.delete({
        where: { id }
      });

      logger.info(`Équipement supprimé: ${equipment.name} par ${deletedBy}`);

      return { success: true, deletedEquipment: equipment };
    } catch (error) {
      logger.error('Erreur lors de la suppression de l\'équipement:', error);
      throw error;
    }
  }

  // Association d'un tag NFC à un équipement
  static async assignNfcTag(equipmentId: string, tagId: string, assignedBy: string) {
    try {
      // Vérifier que l'équipement existe
      const equipment = await prisma.equipment.findUnique({
        where: { id: equipmentId }
      });

      if (!equipment) {
        throw new Error('Équipement non trouvé');
      }

      // Vérifier que le tag n'est pas déjà assigné à un autre équipement
      const existingTag = await prisma.nfcTag.findUnique({
        where: { tagId },
        include: { equipment: true }
      });

      if (existingTag && existingTag.equipmentId && existingTag.equipmentId !== equipmentId) {
        throw new Error(`Ce tag est déjà assigné à l'équipement: ${existingTag.equipment?.name}`);
      }

      // Créer ou mettre à jour le tag
      const nfcTag = await prisma.nfcTag.upsert({
        where: { tagId },
        update: {
          equipmentId,
          isActive: true
        },
        create: {
          tagId,
          equipmentId,
          isActive: true
        }
      });

      // Créer un événement
      await prisma.equipmentEvent.create({
        data: {
          equipmentId,
          type: EventType.TAG_ASSIGNED,
          description: `Tag NFC assigné: ${tagId}`,
          userId: assignedBy,
          metadata: {
            tagId: nfcTag.tagId,
            action: 'tag_assign'
          }
        }
      });

      logger.info(`Tag NFC ${tagId} assigné à l'équipement ${equipment.name}`);

      const updatedEquipment = await prisma.equipment.findUnique({
        where: { id: equipmentId },
        include: equipmentInclude
      });

      if (!updatedEquipment) {
        throw new Error('Équipement non trouvé après mise à jour du tag');
      }

      return updatedEquipment;
    } catch (error) {
      logger.error('Erreur lors de l\'assignation du tag NFC:', error);
      throw error;
    }
  }

  // Suppression d'un tag NFC d'un équipement
  static async removeNfcTag(equipmentId: string, removedBy: string) {
    try {
      const equipment = await prisma.equipment.findUnique({
        where: { id: equipmentId },
        include: { tag: true }
      });

      if (!equipment) {
        throw new Error('Équipement non trouvé');
      }

      if (!equipment.tag) {
        throw new Error('Aucun tag NFC assigné à cet équipement');
      }

      // Supprimer l'association (pas le tag lui-même)
      await prisma.nfcTag.update({
        where: { id: equipment.tag.id },
        data: {
          equipmentId: null,
          isActive: false
        }
      });

      // Créer un événement
      await prisma.equipmentEvent.create({
        data: {
          equipmentId,
          type: EventType.TAG_REMOVED,
          description: `Tag NFC retiré: ${equipment.tag.tagId}`,
          userId: removedBy,
          metadata: {
            tagId: equipment.tag.tagId,
            action: 'tag_remove'
          }
        }
      });

      logger.info(`Tag NFC ${equipment.tag.tagId} retiré de l'équipement ${equipment.name}`);

      const updatedEquipment = await prisma.equipment.findUnique({
        where: { id: equipmentId },
        include: equipmentInclude
      });

      if (!updatedEquipment) {
        throw new Error('Équipement non trouvé après suppression du tag');
      }

      return updatedEquipment;
    } catch (error) {
      logger.error('Erreur lors de la suppression du tag NFC:', error);
      throw error;
    }
  }

  // Récupérer les statistiques des équipements
  static async getStatistics() {
    try {
      const [
        totalCount,
        statusCounts,
        categoryCounts,
        recentActivity
      ] = await Promise.all([
        // Nombre total d'équipements
        prisma.equipment.count(),

        // Répartition par statut
        prisma.equipment.groupBy({
          by: ['status'],
          _count: true
        }),

        // Répartition par catégorie
        prisma.equipment.groupBy({
          by: ['category'],
          _count: true
        }),

        // Activité récente (derniers événements)
        prisma.equipmentEvent.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            equipment: {
              select: { id: true, name: true }
            },
            user: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        })
      ]);

      return {
        totalEquipments: totalCount,
        byStatus: statusCounts.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {} as Record<string, number>),
        byCategory: categoryCounts.map(item => ({
          category: item.category,
          count: item._count
        })),
        recentActivity
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}