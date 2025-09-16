# CLAUDE.md - Commandes de Développement

> Fichier de référence pour Claude AI avec toutes les commandes et processus de développement

## 🎯 Commandes Principales

### Développement
```bash
# Démarrage développement complet
npm run dev

# Démarrage backend seul
npm run dev:backend

# Démarrage frontend seul
npm run dev:frontend

# Build production
npm run build

# Prévisualisation production
npm run preview
```

### Tests et Qualité
```bash
# Tests complets
npm run test

# Tests par type
npm run test:unit
npm run test:integration
npm run test:e2e

# Couverture de tests
npm run test:coverage

# Linting et formatage
npm run lint
npm run lint:fix
npm run format

# Vérification types TypeScript
npm run typecheck
```

### Base de Données
```bash
# Prisma - génération client
npx prisma generate

# Migrations
npx prisma migrate dev
npx prisma migrate deploy

# Interface graphique DB
npx prisma studio

# Reset DB
npx prisma migrate reset
```

### Docker
```bash
# Démarrage environnement complet
docker-compose up -d

# Arrêt
docker-compose down

# Rebuild images
docker-compose up --build

# Logs
docker-compose logs -f
```

## 📋 Processus de Développement

### Avant Chaque Session de Code
1. ✅ Lire BREAKDOWN.md pour voir les tâches en cours
2. ✅ Mettre à jour todo list dans Claude
3. ✅ Vérifier que tous les tests passent : `npm run test`
4. ✅ Vérifier types TypeScript : `npm run typecheck`

### Après Chaque Changement Important
1. ✅ Exécuter linter : `npm run lint`
2. ✅ Vérifier types : `npm run typecheck`  
3. ✅ Lancer tests impactés : `npm run test`
4. ✅ Mettre à jour BREAKDOWN.md
5. ✅ Marquer tâche comme complétée dans todo list

### Avant Commit (OBLIGATOIRE)
```bash
# Vérifications complètes
npm run lint && npm run typecheck && npm run test && npm run build
```

## 🔧 Configuration Développement

### Variables d'Environnement (.env)
```bash
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/nfc_equipment"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# App
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"

# Sécurité
BCRYPT_ROUNDS=10
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900000
```

### Ports Utilisés
- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:5000  
- **PostgreSQL** : localhost:5432
- **Prisma Studio** : http://localhost:5555

## 📁 Structure Importante

### Backend (src/)
```
src/
├── controllers/     # Logique métier
├── middleware/      # Middleware Express
├── routes/         # Routes API
├── services/       # Services business
├── types/          # Types TypeScript
├── utils/          # Utilitaires
└── app.ts          # Configuration Express
```

### Frontend (src/)
```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages/écrans
├── hooks/         # Hooks personnalisés (useNFC)
├── store/         # Redux store
├── services/      # Services API
├── types/         # Types TypeScript
├── utils/         # Utilitaires
└── App.tsx        # App principale
```

## 🧪 Tests à Exécuter

### Tests Backend
```bash
cd backend
npm run test:unit          # Controllers, services
npm run test:integration   # Routes API
npm run test:db           # Tests base de données
```

### Tests Frontend  
```bash
cd frontend
npm run test:unit         # Composants, hooks
npm run test:integration  # Flux utilisateur
npm run test:nfc         # Tests spécifiques NFC
```

### Tests NFC sur Dispositif
1. Déployer sur serveur HTTPS
2. Tester sur Android Chrome 89+
3. Vérifier lecture tags existants
4. Vérifier écriture nouveaux tags
5. Tester gestion erreurs (NFC désactivé, tag incompatible)

## 🚨 Checklist Avant Livraison

### Fonctionnel
- [ ] Toutes les fonctionnalités CCTP implémentées
- [ ] Tests NFC réussis sur dispositif Android
- [ ] Authentification et rôles fonctionnels
- [ ] Export CSV opérationnel
- [ ] PWA installable

### Technique
- [ ] Tous tests unitaires passent (>80% couverture)
- [ ] Tests d'intégration passent
- [ ] Linting sans erreur
- [ ] TypeScript sans erreur
- [ ] Build production réussi
- [ ] Docker compose fonctionnel

### Sécurité
- [ ] HTTPS configuré
- [ ] Headers sécurisés
- [ ] Validation entrées utilisateur
- [ ] Pas de secrets en dur dans le code
- [ ] Rate limiting activé

### Documentation
- [ ] README.md à jour
- [ ] Documentation API complète
- [ ] Guide utilisateur finalisé
- [ ] BREAKDOWN.md complété à 100%

## 🔄 Workflow Git

```bash
# Avant de commencer une tâche
git status
git pull origin main

# Pendant développement
git add .
git commit -m "feat: description claire"

# Tests avant push
npm run lint && npm run typecheck && npm run test

# Push
git push origin main
```

## 🎯 Objectifs par Phase

### Phase 1-3 : Foundation (Backend + DB)
**Objectif** : API fonctionnelle avec auth et CRUD équipements  
**Validation** : `curl` tests sur toutes les routes

### Phase 4-7 : Frontend Core
**Objectif** : Interface React avec authentification  
**Validation** : Login/logout fonctionnel

### Phase 8 : NFC Integration
**Objectif** : Hook useNFC opérationnel  
**Validation** : Tests sur dispositif Android réel

### Phase 9-11 : PWA + Docker
**Objectif** : Application deployable  
**Validation** : Installation PWA + docker-compose up

### Phase 12-14 : Tests + Documentation
**Objectif** : Prototype prêt pour démo  
**Validation** : Toutes checklist validées

---

*Ce fichier doit être consulté à chaque session de développement*