# 🏷️ NFC Equipment Manager

> **Prototype de gestion d'équipements avec technologie NFC**
> **État actuel :** Backend API fonctionnel ✅ | Frontend à implémenter 🚧

## 📋 Description

Application web moderne permettant la gestion d'équipements via la technologie NFC (Near Field Communication). Le système utilise l'API Web NFC pour lire et écrire des tags NDEF, offrant une solution efficace pour le suivi des équipements sur le terrain.

### ✅ Fonctionnalités Implémentées

- **API Backend complète** : 11 endpoints REST avec authentification JWT
- **Gestion d'équipements** : CRUD complet avec filtres, pagination, recherche
- **Association NFC** : Liaison équipements ↔ tags NFC
- **Authentification sécurisée** : JWT avec rôles utilisateur (ADMIN/USER)
- **Export de données** : CSV des équipements avec filtres personnalisés
- **Historique complet** : Traçabilité automatique des événements
- **Statistiques** : Répartition par statut et catégorie
- **Sécurité avancée** : Rate limiting, CORS, validation stricte

### 🚧 En Cours de Développement

- **Frontend React** : Interface utilisateur (Phase 6)
- **Intégration NFC** : Lecture/écriture tags via Web NFC API (Phase 8)
- **PWA** : Application progressive installable sur mobile

---

## 🏗️ Architecture Technique

### Backend ✅ (Fonctionnel)
- **Runtime :** Node.js 18+ + Express
- **Langage :** TypeScript avec types stricts
- **Base de données :** PostgreSQL + Prisma ORM
- **Authentification :** JWT + bcrypt + rôles
- **Sécurité :** Rate limiting, CORS, validation, logs
- **API :** 11 endpoints REST documentés

### Frontend 🚧 (À implémenter)
- **Framework :** React 18+ avec TypeScript
- **UI :** Ant Design ou Material-UI
- **État :** Context API + hooks personnalisés
- **PWA :** Service Worker + Manifest
- **NFC :** Web NFC API (Android Chrome 89+)

### Base de Données ✅
```typescript
// Modèles principaux
User {
  id, email, password, firstName, lastName
  role: ADMIN | USER
  isActive, timestamps
}

Equipment {
  id, name, description, category, location, notes
  status: IN_SERVICE | OUT_OF_SERVICE | MAINTENANCE | LOANED
  createdBy, timestamps
}

NfcTag {
  id, tagId, equipmentId, isActive
}

EquipmentEvent {
  id, equipmentId, userId, type, description
  metadata: JSON, createdAt
}
```

---

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** 18+ (recommandé via NVM)
- **PostgreSQL** 14+
- **Git** pour clonage

### Installation Rapide

```bash
# 1. Cloner le projet
git clone <url-repository>
cd nfc_claude

# 2. Configuration environnement
cp .env.example .env
# Éditer .env avec vos paramètres de base de données

# 3. Installation dépendances
npm install

# 4. Configuration base de données
npm run db:migrate      # Créer les tables
npm run db:seed         # Données de test (optionnel)

# 5. Démarrage développement
npm run dev:backend     # API sur http://localhost:5000
```

### Variables d'Environnement

```bash
# .env (exemple)
DATABASE_URL="postgresql://postgres:password@localhost:5432/nfc_equipment"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"
BCRYPT_ROUNDS=10
```

---

## 🎯 API Endpoints Disponibles

### Authentification
```http
POST /api/auth/register          # Inscription utilisateur
POST /api/auth/login             # Connexion
GET  /api/auth/me                # Profil utilisateur
PUT  /api/auth/me                # Modifier profil
POST /api/auth/change-password   # Changer mot de passe
POST /api/auth/logout            # Déconnexion
```

### Gestion d'Équipements
```http
GET    /api/equipments             # Liste avec filtres/pagination
POST   /api/equipments             # Créer équipement
GET    /api/equipments/:id         # Détail équipement + historique
PUT    /api/equipments/:id         # Modifier équipement
DELETE /api/equipments/:id         # Supprimer équipement
GET    /api/equipments/statistics  # Statistiques globales
GET    /api/equipments/export      # Export CSV
```

### Tags NFC
```http
POST   /api/equipments/:id/nfc-tag    # Assigner tag NFC
DELETE /api/equipments/:id/nfc-tag    # Retirer tag NFC
```

### Test de Connectivité
```http
GET /health                      # Status de l'API
```

---

## 🧪 Tests et Développement

### Scripts de Développement

```bash
# Développement
npm run dev:backend      # Backend seul (port 5000)
npm run dev:frontend     # Frontend seul (port 3000) - À implémenter
npm run dev              # Backend + Frontend simultanément

# Qualité de code
npm run typecheck        # Vérification TypeScript
npm run lint            # ESLint
npm run lint:fix        # Fix automatique des erreurs lint
npm run build           # Build de production

# Base de données
npm run db:migrate      # Appliquer migrations
npm run db:studio       # Interface graphique Prisma
npm run db:reset        # Reset complet (dev uniquement)
npm run db:seed         # Injecter données de test
```

### Tests d'API (exemple avec curl)

```bash
# Test de santé
curl http://localhost:5000/health

# Inscription utilisateur
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Créer un équipement (avec token JWT)
curl -X POST http://localhost:5000/api/equipments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Ordinateur Portable",
    "category": "Informatique",
    "status": "IN_SERVICE",
    "location": "Bureau 101"
  }'
```

---

## 🔐 Sécurité

### Mesures Implementées
- **HTTPS** requis en production (obligatoire pour Web NFC)
- **JWT** avec expiration configurable
- **bcrypt** pour hash des mots de passe (10 rounds)
- **Rate limiting** : 100 req/15min par IP
- **CORS** configuré pour domaines autorisés
- **Validation stricte** de toutes les entrées
- **Headers de sécurité** : HSTS, CSP, XSS Protection
- **Logs structurés** pour audit et monitoring

### Configuration Production
```bash
# Variables critiques à modifier
JWT_SECRET="generate-a-strong-random-secret-256-bits"
BCRYPT_ROUNDS=12
NODE_ENV="production"
LOG_LEVEL="warn"
```

---

## 🔧 Compatibilité NFC

⚠️ **Important** : L'API Web NFC est uniquement supportée sur :
- **Android :** Chrome 89+, Opera, Samsung Internet
- **Requires :** HTTPS + permissions utilisateur

❌ **Non supporté :** iOS/Safari, tous navigateurs desktop

### Test NFC (quand implémenté)
1. Déployer sur HTTPS
2. Utiliser un appareil Android compatible
3. Activer NFC dans les paramètres
4. Tester avec tags NDEF programmables

---

## 🐳 Déploiement

### Docker (Recommandé)

```bash
# Déploiement complet avec Docker
git clone <url-repo>
cd nfc_claude
cp .env.example .env  # Configurer les variables

# Script de déploiement automatique
chmod +x deploy-docker.sh
./deploy-docker.sh

# Ou manuellement
docker-compose up -d
```

### PM2 (Production)

```bash
# Installation PM2
npm install -g pm2

# Déploiement avec PM2
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 📊 Structure du Projet

```
nfc_claude/
├── 📁 backend/                  # API Node.js + Express ✅
│   ├── 📁 src/
│   │   ├── 📁 controllers/      # Logique métier
│   │   ├── 📁 services/         # Services business
│   │   ├── 📁 routes/           # Routes Express
│   │   ├── 📁 middleware/       # Auth, sécurité, logs
│   │   ├── 📁 validators/       # Validation des données
│   │   ├── 📁 types/            # Types TypeScript
│   │   └── 📁 utils/            # Utilitaires
│   ├── 📁 prisma/               # ORM + migrations
│   ├── 📁 tests/                # Tests backend
│   └── 📁 logs/                 # Logs application
├── 📁 frontend/                 # Interface React 🚧
├── 📁 docker/                   # Configuration Docker
├── 📁 docs/                     # Documentation
├── 📋 BREAKDOWN.md              # Plan de développement détaillé
├── ⚙️ CLAUDE.md                 # Commandes pour Claude AI
├── 🐳 docker-compose.yml        # Stack Docker
└── 📖 README.md                 # Ce fichier
```

---

## 🗺️ Roadmap

### ✅ Phase 1-5 : Foundation + Backend API (Terminé)
- Structure projet avec workspaces
- Backend TypeScript + Express complet
- Base de données PostgreSQL + Prisma
- Authentification JWT sécurisée
- API REST équipements complète

### 🚧 Phases Suivantes (Priorité)

**Phase 6 : Frontend React** [PRIORITÉ HAUTE]
- Interface utilisateur avec authentification
- Composants de gestion d'équipements
- Tableau avec filtres et pagination

**Phase 8 : NFC Integration** [PRIORITÉ HAUTE]
- Hook useNFC personnalisé
- Composants de scan NFC
- Association équipements ↔ tags

**Phase 10 : PWA** [PRIORITÉ MOYENNE]
- Service Worker pour mode hors-ligne
- Installation sur mobile
- Notifications push (optionnel)

---

## 📚 Documentation

- 📋 **[Plan de développement](BREAKDOWN.md)** - État détaillé du projet
- ⚙️ **[Commandes Claude](CLAUDE.md)** - Guide pour Claude AI
- 🔧 **[Configuration](docs/)** - Guides d'installation détaillés

---

## 🤝 Développement et Support

- **Développé par :** Claude AI (Anthropic)
- **Type :** Prototype/Proof of Concept
- **Licence :** MIT
- **Support :** Issues GitHub

### Contributions
Ce projet est un prototype. Pour toute suggestion ou amélioration :
1. Ouvrir une issue pour discussion
2. Fork + Pull Request avec description détaillée
3. Respecter les conventions de code (ESLint + Prettier)

---

## 📝 Notes Importantes

1. **Prototype fonctionnel** : Backend API complet et testé
2. **Support NFC limité** : Android uniquement (Web NFC API)
3. **HTTPS requis** : Obligatoire pour Web NFC en production
4. **Performance** : Optimisé pour <500 équipements
5. **Sécurité** : Configuration production requise avant déploiement

---

*Dernière mise à jour : 16 septembre 2025*