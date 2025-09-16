# NFC Equipment Manager

> Prototype de gestion d'équipements avec technologie NFC intégrée

## 📋 Description

Application web permettant la gestion d'équipements via la technologie NFC (Near Field Communication). Le système utilise l'API Web NFC pour lire et écrire des tags NDEF, permettant un suivi efficace des équipements sur le terrain.

### Fonctionnalités Principales

- ✅ **Gestion d'équipements** : Création, modification, consultation et recherche
- 🏷️ **Intégration NFC** : Lecture/écriture de tags NDEF via Web NFC API
- 👥 **Authentification** : Gestion des utilisateurs avec rôles (admin/user)
- 📱 **PWA** : Application progressive installable sur mobile
- 📊 **Historique** : Traçabilité des événements (prêt, retour, maintenance)
- 📤 **Export** : Export des données en format CSV
- 🔒 **Sécurité** : HTTPS, JWT, chiffrement des mots de passe

## 🏗️ Architecture Technique

### Frontend
- **Framework** : React 18+ avec TypeScript
- **UI** : Ant Design / Material-UI
- **État** : Redux Toolkit
- **PWA** : Service Worker + Manifest
- **NFC** : Web NFC API (Android uniquement)

### Backend
- **Runtime** : Node.js + Express
- **Langage** : TypeScript
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Auth** : JWT + bcrypt

### Déploiement
- **Containerisation** : Docker + Docker Compose
- **Sécurité** : HTTPS/TLS, Headers sécurisés
- **Monitoring** : Logs centralisés

## 🔧 Compatibilité NFC

⚠️ **Important** : L'API Web NFC n'est supportée que sur :
- Chrome 89+ (Android)
- Opera (Android)  
- Samsung Internet (Android)

❌ **Non supporté** : iOS/Safari, navigateurs desktop

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- PostgreSQL 13+
- Docker (optionnel)

### Installation Rapide

```bash
# Cloner le projet
git clone <url-repository>
cd nfc_claude

# Installation des dépendances
npm install

# Configuration environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Démarrage avec Docker
docker-compose up -d

# OU démarrage manuel
npm run dev:backend &
npm run dev:frontend
```

### Scripts Disponibles

```bash
npm run dev            # Démarrage développement (front + back)
npm run build          # Build production
npm run test           # Lancer tous les tests
npm run lint           # Vérification code
npm run typecheck      # Vérification types TypeScript
npm run docker:up      # Démarrage Docker
npm run docker:down    # Arrêt Docker
```

## 📖 Documentation

- 📚 [Guide d'installation détaillé](docs/INSTALLATION.md)
- 👨‍💻 [Documentation API](docs/API.md)
- 🎯 [Guide utilisateur](docs/USER_GUIDE.md)
- 🏗️ [Architecture technique](docs/ARCHITECTURE.md)
- ✅ [Breakdown des tâches](BREAKDOWN.md)

## 🧪 Tests

### Tests Unitaires
```bash
npm run test:unit          # Tests unitaires
npm run test:integration   # Tests d'intégration
npm run test:e2e          # Tests end-to-end
```

### Tests NFC
Les tests NFC nécessitent un dispositif Android avec navigateur compatible :
1. Activer NFC sur l'appareil
2. Ouvrir l'application dans Chrome/Opera
3. Tester lecture/écriture avec des tags NDEF

## 🔐 Sécurité

- **HTTPS** obligatoire en production
- **JWT** pour l'authentification
- **bcrypt** pour le hachage des mots de passe
- **CORS** configuré
- **Rate limiting** sur les API
- **Validation** des entrées utilisateur
- **Headers** de sécurité (HSTS, CSP, etc.)

## 📊 Structure du Projet

```
nfc_claude/
├── backend/              # API Node.js + Express
│   ├── src/
│   ├── prisma/          # Schémas base de données
│   └── tests/
├── frontend/            # Application React
│   ├── src/
│   ├── public/
│   └── tests/
├── docs/                # Documentation
├── docker/              # Configuration Docker
├── BREAKDOWN.md         # Détail des tâches
├── CLAUDE.md           # Commandes pour Claude
└── README.md           # Ce fichier
```

## 👥 Équipe et Support

- **Développement** : Claude AI (Anthropic)
- **Type** : Prototype/POC
- **Licence** : MIT
- **Support** : Issues GitHub

## 🗺️ Roadmap

### Version 1.0 (Prototype)
- [x] Structure de base
- [ ] Backend API
- [ ] Frontend React
- [ ] Intégration NFC
- [ ] Authentification
- [ ] Tests basiques

### Version 2.0 (Production)
- [ ] Optimisations performance
- [ ] Tests complets
- [ ] Monitoring avancé
- [ ] Intégration SAP (optionnel)
- [ ] Support multi-langues

---

## 📝 Notes Importantes

1. **Prototype uniquement** : Cette version est destinée à valider la faisabilité
2. **Support NFC limité** : Android uniquement via Web NFC API
3. **Sécurité** : Configuration HTTPS requise pour Web NFC
4. **Performance** : Optimisée pour <50 équipements simultanés

---

*Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}*