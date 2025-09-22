# CLAUDE.md - Guide de Développement

> **Fichier de référence pour Claude AI** - Toutes les commandes et processus de développement
> **État actuel :** Backend API ✅ | Frontend React ✅ | NFC Integration ✅

## 🎯 Commandes Principales

### Commandes Make (Recommandées)
```bash
# Développement
make dev                    # Backend + Frontend en parallèle
make dev-backend           # Backend seul sur http://localhost:5000
make dev-frontend          # Frontend seul sur http://localhost:3000

# Déploiement Docker
make deploy                # Build + Déploiement complet
make deploy-backend        # Déploiement backend seul
make deploy-frontend       # Déploiement frontend seul

# Gestion services
make up                    # Démarrer tous les services Docker
make down                  # Arrêter tous les services
make restart               # Redémarrer les services
make status                # Statut des services

# Qualité code
make check                 # Vérifications complètes (typecheck + lint + test)
make typecheck             # Vérification TypeScript
make lint                  # Vérification style
make test                  # Exécuter tous les tests

# Base de données
make migrate               # Exécuter migrations
make db-studio             # Ouvrir Prisma Studio
make backup-db             # Sauvegarder la base
```

### Commandes NPM (Alternatives)
```bash
# Développement
npm run dev                 # Backend + Frontend en parallèle
npm run dev:backend         # Backend sur http://localhost:5000
npm run dev:frontend        # Frontend sur http://localhost:3000

# Build production
npm run build               # Build backend + frontend
npm run build:backend       # Backend seul
npm run build:frontend      # Frontend seul
```

### Tests et Qualité
```bash
# Vérifications obligatoires avant commit
npm run typecheck           # Vérification TypeScript (backend)
npm run lint               # ESLint sur tout le projet
npm run lint:fix           # Fix automatique des erreurs lint

# Tests (quand implémentés)
npm run test               # Tests complets
npm run test:unit          # Tests unitaires
npm run test:integration   # Tests d'intégration API
npm run test:e2e           # Tests end-to-end (à implémenter)
npm run test:coverage      # Couverture de tests
```

### Base de Données (Prisma)
```bash
# Génération client Prisma (après modification schéma)
npx prisma generate

# Migrations base de données
npx prisma migrate dev      # Créer et appliquer migration (dev)
npx prisma migrate deploy   # Appliquer migrations (production)
npx prisma migrate reset    # Reset complet DB (dev uniquement)

# Interface graphique base de données
npx prisma studio          # http://localhost:5555

# Données de test (si seed configuré)
npx prisma db seed         # Injecter données de test
```

### Docker
```bash
# Environnement complet avec Docker
docker-compose up -d        # Démarrer en arrière-plan
docker-compose down         # Arrêter tous les services
docker-compose up --build  # Rebuild et démarrer
docker-compose logs -f     # Suivre les logs en temps réel

# Services individuels
docker-compose up backend  # Backend seul
docker-compose up db       # PostgreSQL seul
```

---

## 📋 Processus de Développement

### ✅ État Actuel (Phases 1-8 Terminées)
- **Backend API** : 11 endpoints REST fonctionnels
- **Authentification** : JWT avec rôles ADMIN/USER
- **Base de données** : PostgreSQL + Prisma avec migrations
- **Sécurité** : Rate limiting, CORS, validation, logs
- **Équipements** : CRUD complet + gestion tags NFC
- **Export** : CSV avec filtres personnalisés
- **Frontend React** : Interface complète avec Tailwind CSS
- **Authentification client** : Login, register, routes protégées
- **Dashboard** : Statistiques et actions rapides
- **Gestion équipements** : Liste, détails, édition
- **NFC Integration** : POC complet avec interface scan/write
- **Déploiement** : Docker + Nginx + Makefile

### 🚧 Prochaines Étapes
1. **PWA** (Phase 10) - PRIORITÉ HAUTE
2. **Tests E2E** (Phase 9) - PRIORITÉ MOYENNE
3. **Optimisations** (Phase 7) - PRIORITÉ BASSE

### Avant Chaque Session de Code
1. ✅ Lire BREAKDOWN.md pour voir l'état d'avancement
2. ✅ Mettre à jour todo list dans Claude
3. ✅ Vérifier que le backend compile : `npm run typecheck`
4. ✅ Vérifier l'état des services : `docker-compose ps`

### Après Chaque Changement Important
1. ✅ Exécuter linter : `npm run lint`
2. ✅ Vérifier types : `npm run typecheck`
3. ✅ Tester l'API modifiée avec curl
4. ✅ Mettre à jour BREAKDOWN.md si phase terminée
5. ✅ Marquer tâche comme complétée dans todo list

### Avant Commit (OBLIGATOIRE)
```bash
# Vérifications complètes backend
cd backend
npm run typecheck && npm run lint && npm run build

# Quand frontend implémenté
npm run typecheck && npm run lint && npm run build
```

---

## 🔧 Configuration Développement

### Variables d'Environnement (.env)
```bash
# Base de données PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/nfc_equipment"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Application
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"

# Sécurité
BCRYPT_ROUNDS=10
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900000

# CORS Origins (séparés par virgules)
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"

# Logs
LOG_LEVEL="info"
```

### Ports Utilisés
- **Backend API** : http://localhost:5000
- **Frontend** : http://localhost:3000 (à implémenter)
- **PostgreSQL** : localhost:5432
- **Prisma Studio** : http://localhost:5555

---

## 📁 Architecture du Projet

### Backend ✅ (Fonctionnel)
```
backend/src/
├── controllers/         # Logique métier des routes
│   ├── authController.ts       # Authentification
│   └── equipmentController.ts  # Gestion équipements
├── middleware/          # Middleware Express
│   ├── auth.ts                # JWT + autorisations
│   ├── security.ts            # Rate limiting, CORS
│   ├── errorHandler.ts        # Gestion erreurs globales
│   └── requestLogger.ts       # Logs des requêtes
├── routes/             # Définition des routes
│   ├── authRoutes.ts          # Routes authentification
│   └── equipmentRoutes.ts     # Routes équipements
├── services/           # Services business
│   ├── authService.ts         # Logique auth
│   └── equipmentService.ts    # Logique équipements
├── validators/         # Validation des données
│   ├── authValidators.ts      # Validation auth
│   └── equipmentValidators.ts # Validation équipements
├── types/              # Types TypeScript
│   ├── env.d.ts              # Types variables d'environnement
│   └── express.d.ts          # Extensions types Express
├── utils/              # Utilitaires
│   └── logger.ts             # Configuration logs Winston
└── app.ts              # Configuration Express principale
```

### Frontend 🚧 (À implémenter - Phase 6)
```
frontend/src/
├── components/         # Composants réutilisables
│   ├── common/               # Composants génériques
│   ├── forms/                # Formulaires
│   └── tables/               # Tableaux avec filtres
├── pages/             # Pages/écrans
│   ├── auth/                 # Login, Register
│   ├── dashboard/            # Tableau de bord
│   └── equipments/           # Gestion équipements
├── hooks/             # Hooks personnalisés
│   ├── useAuth.ts            # Hook authentification
│   ├── useNFC.ts             # Hook Web NFC API
│   └── useApi.ts             # Hook appels API
├── services/          # Services API client
│   ├── api.ts                # Client API Axios
│   ├── authService.ts        # Service auth client
│   └── equipmentService.ts   # Service équipements client
├── types/             # Types TypeScript partagés
├── utils/             # Utilitaires client
└── App.tsx            # Composant App principal
```

---

## 🎯 API Endpoints Disponibles

### Authentification (✅ Implémenté)
```http
POST /api/auth/register          # Inscription utilisateur
POST /api/auth/login             # Connexion + JWT
GET  /api/auth/me                # Profil utilisateur courant
PUT  /api/auth/me                # Modifier profil
POST /api/auth/change-password   # Changer mot de passe
POST /api/auth/logout            # Déconnexion (log only)
```

### Gestion d'Équipements (✅ Implémenté)
```http
GET    /api/equipments             # Liste avec filtres/pagination
POST   /api/equipments             # Créer équipement
GET    /api/equipments/:id         # Détail équipement + historique
PUT    /api/equipments/:id         # Modifier équipement
DELETE /api/equipments/:id         # Supprimer équipement
GET    /api/equipments/statistics  # Statistiques globales
GET    /api/equipments/export      # Export CSV
```

### Tags NFC (✅ Implémenté)
```http
POST   /api/equipments/:id/nfc-tag    # Assigner tag NFC
DELETE /api/equipments/:id/nfc-tag    # Retirer tag NFC
```

### Utilitaires
```http
GET /health                      # État de l'API
```

---

## 🧪 Tests d'API avec curl

### Test de Santé
```bash
curl http://localhost:5000/health
```

### 🔬 Tests NFC sur Android

#### Prérequis Tests NFC
```bash
# Déploiement HTTPS obligatoire
make deploy                # Ou docker-compose up avec Nginx SSL
# Interface accessible sur https://votre-domaine.com

# Prérequis Android
✅ Appareil Android avec NFC
✅ Chrome for Android 89+
✅ NFC activé dans paramètres
✅ Tags NFC NDEF programmables
✅ Connexion HTTPS au serveur
```

#### Procédure Test NFC Complète
```bash
# 1. Vérifier déploiement HTTPS
curl -k https://votre-domaine.com/health
# Réponse : {"status": "ok", "timestamp": "..."}

# 2. Accéder interface NFC sur Android
# Chrome Android -> https://votre-domaine.com/nfc

# 3. Tests interface NFC
# -> Composant NFCSupport affiche "NFC Ready!" sur Android Chrome
# -> Onglet "Scan Tags" disponible
# -> Onglet "Write Tags" disponible avec sélection équipements

# 4. Test écriture NFC
# -> Sélectionner équipement dans sidebar
# -> Cliquer "Write to NFC Tag"
# -> Approcher tag NFC près du dispositif Android
# -> Message "Successfully Written!" avec détails équipement

# 5. Test lecture NFC
# -> Onglet "Scan Tags"
# -> Cliquer "Start Scan"
# -> Approcher tag écrit précédemment
# -> Données équipement affichées avec bouton "View Details"

# 6. Test navigation
# -> Cliquer "View Details" depuis scan
# -> Redirection vers /equipments/{id} avec détails équipement
```

#### Messages d'Erreur NFC
```bash
# Erreurs attendues et solutions
"NFC Not Supported" -> Utiliser Android Chrome 89+
"HTTPS connection required" -> Déployer avec SSL
"Permission denied" -> Autoriser NFC dans Chrome
"Failed to write" -> Réessayer, vérifier proximité tag
```

### Authentification
```bash
# Inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Connexion (récupérer le token JWT)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Profil utilisateur (avec token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5000/api/auth/me
```

### Équipements
```bash
# Créer équipement
curl -X POST http://localhost:5000/api/equipments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Ordinateur Portable",
    "category": "Informatique",
    "status": "IN_SERVICE",
    "location": "Bureau 101"
  }'

# Liste équipements
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:5000/api/equipments?page=1&limit=10"

# Statistiques
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5000/api/equipments/statistics

# Export CSV
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5000/api/equipments/export \
     -o equipments.csv
```

---

## 🚨 Checklist Avant Livraison

### ✅ Fonctionnel (Phase 1-5 Terminées)
- [x] Backend API complet et documenté
- [x] Authentification JWT avec rôles fonctionnelle
- [x] CRUD équipements avec validation
- [x] Association tags NFC aux équipements
- [x] Export CSV opérationnel
- [x] Historique des événements automatique

### 🚧 Fonctionnel (À implémenter)
- [ ] Frontend React avec authentification
- [ ] Interface de gestion d'équipements
- [ ] Tests NFC réussis sur dispositif Android
- [ ] PWA installable sur mobile

### ✅ Technique (Actuel)
- [x] Compilation TypeScript sans erreur
- [x] Linting sans erreur
- [x] Structure de code cohérente
- [x] Types TypeScript complets
- [x] Build backend réussi

### 🚧 Technique (À valider)
- [ ] Tests unitaires implémentés (>80% couverture)
- [ ] Tests d'intégration API
- [ ] Tests E2E frontend
- [ ] Docker compose fonctionnel

### ✅ Sécurité (Implémentée)
- [x] JWT avec secrets sécurisés
- [x] Hash bcrypt des mots de passe
- [x] CORS configuré
- [x] Rate limiting activé (100 req/15min)
- [x] Validation stricte des entrées
- [x] Headers de sécurité (HSTS, CSP, etc.)
- [x] Logs structurés pour audit

### 🚧 Sécurité (À valider en production)
- [ ] HTTPS configuré et forcé
- [ ] Pas de secrets en dur dans le code
- [ ] Variables d'environnement sécurisées

### ✅ Documentation (À jour)
- [x] README.md complet et à jour
- [x] BREAKDOWN.md détaillé
- [x] CLAUDE.md (ce fichier) à jour
- [x] API endpoints documentés
- [x] Structure projet documentée

---

## 🔄 Workflow Git

```bash
# Avant de commencer une tâche
git status                   # Vérifier état local
git pull origin main         # Récupérer dernières modifs

# Pendant développement
git add .                    # Ajouter modifications
git commit -m "feat: description précise du changement"

# Tests obligatoires avant push
cd backend
npm run lint                 # Vérifier style
npm run typecheck           # Vérifier types
npm run build               # Vérifier compilation

# Push seulement si tous les tests passent
git push origin main
```

### Convention de Messages de Commit
```bash
# Format: type: description
feat: add JWT authentication middleware
fix: resolve equipment creation validation error
docs: update API documentation
refactor: improve equipment service structure
test: add unit tests for auth controller
```

---

## 🎯 Objectifs par Phase

### ✅ Phase 1-5 : Foundation + Backend API (TERMINÉ)
**Objectif :** API REST fonctionnelle avec authentification
**Status :** ✅ COMPLET
- Backend TypeScript + Express
- Base de données PostgreSQL + Prisma
- Authentification JWT sécurisée
- API équipements complète
- **Validation :** 11 endpoints testés avec curl

### ✅ Phase 6 : Frontend React (Terminé)
**Objectif :** Interface utilisateur fonctionnelle
**Status :** ✅ COMPLET
- ✅ Interface React avec TypeScript + Vite
- ✅ Authentification côté client avec AuthContext
- ✅ Gestion d'équipements avec CRUD complet
- ✅ Dashboard avec statistiques temps réel
- **Validation :** Login/logout + CRUD équipements fonctionnels

### ✅ Phase 8 : NFC Integration (Terminé)
**Objectif :** Fonctionnalité NFC complète
**Status :** ✅ POC COMPLET ET FONCTIONNEL
- ✅ Hook useNFC pour Web NFC API avec state management
- ✅ Composants NFCSupport, NFCScanner, NFCWriter
- ✅ Interface NFC complète avec onglets scan/write
- ✅ Association physique tags ↔ équipements
- ✅ Détection compatibilité navigateur et platform
- **Validation :** Interface fonctionnelle, tests à faire sur Android réel

### 🚧 Phase 10 : PWA [PRIORITÉ HAUTE]
**Objectif :** Application installable et utilisable hors-ligne
**Status :** 🚧 À IMPLÉMENTER
- [ ] Service Worker configuré
- [ ] Manifest.json pour installation
- [ ] Mode hors-ligne basique
- **Validation :** Installation PWA réussie sur Android

---

## 📝 Notes Importantes pour Claude

### Contexte Actuel
- **Backend complet et fonctionnel** avec 11 endpoints REST
- **Frontend React opérationnel** avec authentification et gestion équipements
- **NFC Integration fonctionnelle** avec POC complet scan/write tags
- **Base de données** configurée avec schémas User, Equipment, NfcTag, EquipmentEvent
- **Sécurité** : JWT, bcrypt, rate limiting, CORS, validation implémentés
- **Déploiement** : Docker + Nginx + Makefile prêts pour production

### Prochaines Actions Recommandées
1. **Phase 10** : Configuration PWA avec service worker
2. **Phase 10** : Manifest.json pour installation mobile
3. **Tests NFC** : Tests sur dispositif Android réel avec tags NFC
4. **Phase 7** : Optimisations performance et bundle size

### Contraintes Techniques NFC (Implémentées)
- **Web NFC** : Android Chrome 89+ uniquement (détection automatique ✅)
- **HTTPS requis** : Obligatoire pour Web NFC en production
- **Interface NFC** : Route `/nfc` avec composants scan/write fonctionnels
- **Compatibilité desktop** : Messages explicites "non supporté"

---

*Ce fichier doit être consulté à chaque session de développement - Dernière mise à jour : 22 septembre 2025*