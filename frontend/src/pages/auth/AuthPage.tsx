import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from '../../components/forms/LoginForm';
import { RegisterForm } from '../../components/forms/RegisterForm';
import './AuthPage.css';

export const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Rediriger vers le dashboard si déjà connecté
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAuthSuccess = () => {
    // La redirection sera gérée par le router
  };

  return (
    <div className="auth-page py-5">
      <div className="container auth-content py-4">
        <div className="row g-5 align-items-center justify-content-between">
          <div className="col-12 col-lg-6 order-2 order-lg-1 text-white">
            <div className="auth-hero-badge d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill text-uppercase small mb-4">
              Prototype interactif
            </div>
            <h2 className="display-5 fw-semibold mb-4">
              Centralisez le suivi de vos équipements NFC.
            </h2>
            <p className="lead text-white-75 mb-4">
              Visualisez en un clin d'œil l'état de votre parc, les maintenances en cours et l'association des tags. Une base solide pour préparer la mise en production.
            </p>
            <div className="row g-3">
              {[
                'Affectation rapide des tags NFC',
                'Suivi des statuts en temps réel',
                'Historique complet des interventions',
                'Interface claire et responsive',
              ].map((item) => (
                <div key={item} className="col-12 col-sm-6">
                  <div className="auth-feature p-4 h-100">
                    <div className="d-flex align-items-start gap-3">
                      <span className="auth-feature-icon">✓</span>
                      <span className="small fw-medium text-white-75">{item}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-5 order-1 order-lg-2">
            <div className="card auth-card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h1 className="h4 fw-semibold mb-2 text-dark">Gestionnaire NFC</h1>
                  <p className="text-muted small mb-0">
                    Connectez-vous pour suivre, prêter et maintenir vos équipements en quelques clics.
                  </p>
                </div>

                <div className="bg-body-tertiary rounded-pill p-1 mb-4">
                  <div className="nav nav-pills nav-fill">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className={`nav-link rounded-pill ${activeTab === 'login' ? 'active' : ''}`}
                    >
                      Connexion
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className={`nav-link rounded-pill ${activeTab === 'register' ? 'active' : ''}`}
                    >
                      Inscription
                    </button>
                  </div>
                </div>

                {activeTab === 'login' ? (
                  <LoginForm
                    onSuccess={handleAuthSuccess}
                    onSwitchToRegister={() => setActiveTab('register')}
                  />
                ) : (
                  <RegisterForm
                    onSuccess={handleAuthSuccess}
                    onSwitchToLogin={() => setActiveTab('login')}
                  />
                )}
              </div>
            </div>

            <p className="text-center text-muted small mt-4 mb-0">
              © 2024 Gestionnaire NFC — Prototype interne
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};