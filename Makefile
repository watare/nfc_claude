# Makefile pour le déploiement du gestionnaire NFC
.PHONY: help build up down restart logs clean dev test lint typecheck migrate

# Variables
COMPOSE_FILE := docker-compose.yml
COMPOSE_DEV_FILE := docker-compose.dev.yml
BACKEND_PORT ?= 5000
FRONTEND_PORT ?= 3000

# Aide par défaut
help: ## Afficher cette aide
	@echo "Gestionnaire NFC - Commandes de déploiement"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# === COMMANDES DE DÉVELOPPEMENT ===

dev: ## Démarrer l'environnement de développement
	@echo "🚀 Démarrage de l'environnement de développement..."
	@echo "Backend: http://localhost:$(BACKEND_PORT) | Frontend: http://localhost:$(FRONTEND_PORT)"
	@export PORT=$(BACKEND_PORT) && export FRONTEND_PORT=$(FRONTEND_PORT) && npm run dev

dev-backend: ## Démarrer uniquement le backend en développement
	@echo "🔧 Démarrage du backend sur le port $(BACKEND_PORT)..."
	cd backend && PORT=$(BACKEND_PORT) npm run dev

dev-frontend: ## Démarrer uniquement le frontend en développement
	@echo "🎨 Démarrage du frontend sur le port $(FRONTEND_PORT)..."
	cd frontend && npm run dev -- --port $(FRONTEND_PORT)

# === COMMANDES DE BUILD ===

build: ## Builder les images Docker
	@echo "🔨 Construction des images Docker..."
	docker compose -f $(COMPOSE_FILE) build

build-nocache: ## Builder les images Docker sans cache
	@echo "🔨 Construction des images Docker (sans cache)..."
	docker compose -f $(COMPOSE_FILE) build --no-cache

build-backend: ## Builder uniquement l'image backend
	@echo "🔧 Construction de l'image backend..."
	docker compose -f $(COMPOSE_FILE) build backend

build-backend-nocache: ## Builder uniquement l'image backend sans cache
	@echo "🔧 Construction de l'image backend (sans cache)..."
	docker compose -f $(COMPOSE_FILE) build --no-cache backend

build-frontend: ## Builder uniquement l'image frontend
	@echo "🎨 Construction de l'image frontend..."
	docker compose -f $(COMPOSE_FILE) build frontend

build-frontend-nocache: ## Builder uniquement l'image frontend sans cache
	@echo "🎨 Construction de l'image frontend (sans cache)..."
	docker compose -f $(COMPOSE_FILE) build --no-cache frontend

# === COMMANDES DE DÉPLOIEMENT ===

up: ## Démarrer tous les services
	@echo "🚀 Démarrage des services..."
	docker compose -f $(COMPOSE_FILE) up -d

up-db: ## Démarrer uniquement la base de données
	@echo "🗄️  Démarrage de la base de données..."
	docker compose -f $(COMPOSE_FILE) up -d db

up-backend: ## Démarrer backend + base de données
	@echo "🔧 Démarrage du backend..."
	docker compose -f $(COMPOSE_FILE) up -d db backend

up-frontend: ## Démarrer tous les services
	@echo "🎨 Démarrage du frontend..."
	docker compose -f $(COMPOSE_FILE) up -d

down: ## Arrêter tous les services
	@echo "🛑 Arrêt des services..."
	docker compose -f $(COMPOSE_FILE) down

restart: ## Redémarrer tous les services
	@echo "🔄 Redémarrage des services..."
	$(MAKE) down
	$(MAKE) up

# === COMMANDES DE MONITORING ===

logs: ## Afficher les logs de tous les services
	docker compose -f $(COMPOSE_FILE) logs -f

logs-backend: ## Afficher les logs du backend
	docker compose -f $(COMPOSE_FILE) logs -f backend

logs-frontend: ## Afficher les logs du frontend
	docker compose -f $(COMPOSE_FILE) logs -f frontend

logs-db: ## Afficher les logs de la base de données
	docker compose -f $(COMPOSE_FILE) logs -f db

status: ## Afficher le statut des services
	@echo "📊 Statut des services:"
	docker compose -f $(COMPOSE_FILE) ps

# === COMMANDES DE BASE DE DONNÉES ===

migrate: ## Exécuter les migrations de base de données
	@echo "🗄️  Exécution des migrations..."
	docker compose -f $(COMPOSE_FILE) exec backend npx prisma migrate deploy

migrate-dev: ## Créer et appliquer une nouvelle migration (dev)
	@echo "🗄️  Création de migration de développement..."
	cd backend && npx prisma migrate dev

db-studio: ## Ouvrir Prisma Studio
	@echo "🔍 Ouverture de Prisma Studio..."
	cd backend && npx prisma studio

db-reset: ## Reset complet de la base de données (ATTENTION!)
	@echo "⚠️  Reset de la base de données..."
	@read -p "Êtes-vous sûr? Cette action est irréversible. [y/N] " confirm && [ "$$confirm" = "y" ]
	docker compose -f $(COMPOSE_FILE) exec backend npx prisma migrate reset --force

db-seed: ## Charger les données de test
	@echo "🌱 Chargement des données de test..."
	docker compose -f $(COMPOSE_FILE) exec backend npm run db:seed

# === COMMANDES DE QUALITÉ ===

test: ## Exécuter tous les tests
	@echo "🧪 Exécution des tests..."
	npm run test

test-backend: ## Exécuter les tests backend
	@echo "🔧 Tests backend..."
	npm run test:backend

test-frontend: ## Exécuter les tests frontend
	@echo "🎨 Tests frontend..."
	npm run test:frontend

lint: ## Vérifier le style de code
	@echo "🧹 Vérification du style..."
	npm run lint

lint-fix: ## Corriger automatiquement le style
	@echo "🔧 Correction automatique du style..."
	npm run lint:fix

typecheck: ## Vérifier les types TypeScript
	@echo "🔍 Vérification des types..."
	npm run typecheck

# === COMMANDES DE NETTOYAGE ===

clean: ## Nettoyer les containers, images et volumes
	@echo "🧹 Nettoyage..."
	docker compose -f $(COMPOSE_FILE) down -v --remove-orphans
	docker system prune -f

clean-all: ## Nettoyage complet (ATTENTION!)
	@echo "⚠️  Nettoyage complet..."
	@read -p "Êtes-vous sûr? Cette action supprimera tout. [y/N] " confirm && [ "$$confirm" = "y" ]
	docker compose -f $(COMPOSE_FILE) down -v --remove-orphans
	docker system prune -af
	docker volume prune -f

clean-node: ## Nettoyer les node_modules
	@echo "🧹 Nettoyage des dépendances..."
	npm run clean

# === COMMANDES DE PRODUCTION ===

deploy: build up ## Déployer en production (build + up)
	@echo "🚀 Déploiement en production terminé!"

deploy-nocache: build-nocache up ## Déployer en production sans cache (build + up)
	@echo "🚀 Déploiement en production (sans cache) terminé!"

deploy-backend: build-backend up-backend ## Déployer uniquement le backend
	@echo "🔧 Déploiement backend terminé!"

deploy-backend-nocache: build-backend-nocache up-backend ## Déployer uniquement le backend sans cache
	@echo "🔧 Déploiement backend (sans cache) terminé!"

deploy-frontend: build-frontend up-frontend ## Déployer uniquement le frontend
	@echo "🎨 Déploiement frontend terminé!"

deploy-frontend-nocache: build-frontend-nocache up-frontend ## Déployer uniquement le frontend sans cache
	@echo "🎨 Déploiement frontend (sans cache) terminé!"

# === COMMANDES D'INSTALLATION ===

install: ## Installer toutes les dépendances
	@echo "📦 Installation des dépendances..."
	npm run setup

install-backend: ## Installer les dépendances backend
	@echo "🔧 Installation backend..."
	npm run setup:backend

install-frontend: ## Installer les dépendances frontend
	@echo "🎨 Installation frontend..."
	npm run setup:frontend

# === COMMANDES DE VALIDATION ===

check: typecheck lint test ## Vérifications complètes avant commit
	@echo "✅ Toutes les vérifications sont passées!"

# === COMMANDES D'EXPORT ===

backup-db: ## Sauvegarder la base de données
	@echo "💾 Sauvegarde de la base de données..."
	mkdir -p ./backups
	docker compose -f $(COMPOSE_FILE) exec db pg_dump -U postgres nfc_equipment > ./backups/backup_$(shell date +%Y%m%d_%H%M%S).sql

# Valeurs par défaut
.DEFAULT_GOAL := help