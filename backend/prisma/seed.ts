import { PrismaClient, UserRole, EquipmentStatus, EventType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Démarrage du seeding de la base de données...');

  // Nettoyage des données existantes (en développement uniquement)
  if (process.env.NODE_ENV === 'development') {
    await prisma.equipmentEvent.deleteMany();
    await prisma.nfcTag.deleteMany();
    await prisma.equipment.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Données existantes supprimées');
  }

  // Création des utilisateurs par défaut
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedUserPassword = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@nfc-equipment.com',
      password: hashedAdminPassword,
      firstName: 'Admin',
      lastName: 'Système',
      role: UserRole.ADMIN,
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      email: 'user@nfc-equipment.com',
      password: hashedUserPassword,
      firstName: 'Utilisateur',
      lastName: 'Test',
      role: UserRole.USER,
    },
  });

  console.log('👥 Utilisateurs créés');

  // Création d'équipements de démonstration
  const equipment1 = await prisma.equipment.create({
    data: {
      name: 'Perceuse sans fil Bosch',
      description: 'Perceuse sans fil 18V avec 2 batteries',
      category: 'Outillage électrique',
      status: EquipmentStatus.IN_SERVICE,
      location: 'Atelier A - Étagère 2',
      notes: 'Vérifier l\'état des batteries avant utilisation',
      createdBy: adminUser.id,
    },
  });

  const equipment2 = await prisma.equipment.create({
    data: {
      name: 'Échelle télescopique 4m',
      description: 'Échelle télescopique aluminium 4 mètres',
      category: 'Équipement sécurité',
      status: EquipmentStatus.IN_SERVICE,
      location: 'Hangar B - Zone stockage',
      createdBy: adminUser.id,
    },
  });

  const equipment3 = await prisma.equipment.create({
    data: {
      name: 'Compresseur portable',
      description: 'Compresseur d\'air portable 50L',
      category: 'Pneumatique',
      status: EquipmentStatus.MAINTENANCE,
      location: 'Atelier C - En maintenance',
      notes: 'Problème de pression - À réparer',
      createdBy: adminUser.id,
    },
  });

  const equipment4 = await prisma.equipment.create({
    data: {
      name: 'Multimètre Fluke',
      description: 'Multimètre numérique haute précision',
      category: 'Instrumentation',
      status: EquipmentStatus.LOANED,
      location: 'Prêté à Jean Dupont',
      notes: 'Retour prévu le 25/09/2025',
      createdBy: adminUser.id,
    },
  });

  console.log('🔧 Équipements créés');

  // Création de tags NFC de démonstration
  const tag1 = await prisma.nfcTag.create({
    data: {
      tagId: 'NFC001',
      equipmentId: equipment1.id,
    },
  });

  const tag2 = await prisma.nfcTag.create({
    data: {
      tagId: 'NFC002',
      equipmentId: equipment2.id,
    },
  });

  // Tag non assigné
  await prisma.nfcTag.create({
    data: {
      tagId: 'NFC003',
    },
  });

  console.log('🏷️ Tags NFC créés');

  // Création d'événements de démonstration
  await prisma.equipmentEvent.create({
    data: {
      equipmentId: equipment1.id,
      type: EventType.TAG_ASSIGNED,
      description: 'Tag NFC assigné à l\'équipement',
      userId: adminUser.id,
      metadata: {
        tagId: tag1.tagId,
        assignedBy: 'Système'
      },
    },
  });

  await prisma.equipmentEvent.create({
    data: {
      equipmentId: equipment4.id,
      type: EventType.LOAN,
      description: 'Équipement prêté à Jean Dupont',
      userId: adminUser.id,
      metadata: {
        borrowerName: 'Jean Dupont',
        expectedReturn: '2025-09-25'
      },
    },
  });

  await prisma.equipmentEvent.create({
    data: {
      equipmentId: equipment3.id,
      type: EventType.MAINTENANCE_START,
      description: 'Début de la maintenance - Problème de pression',
      userId: normalUser.id,
      metadata: {
        issue: 'Pression insuffisante',
        priority: 'HIGH'
      },
    },
  });

  console.log('📝 Événements créés');

  console.log('✅ Seeding terminé avec succès !');
  console.log(`
📊 Données créées:
- 👥 ${2} utilisateurs (admin@nfc-equipment.com / admin123, user@nfc-equipment.com / user123)
- 🔧 ${4} équipements de démonstration
- 🏷️ ${3} tags NFC (2 assignés, 1 libre)
- 📝 ${3} événements historiques
`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur durant le seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });