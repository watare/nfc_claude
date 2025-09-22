import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { LoginForm } from '../../components/forms/LoginForm';
import { RegisterForm } from '../../components/forms/RegisterForm';

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
    <div className="relative min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#38bdf8_0%,_transparent_55%)] opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_#0f172a_0%,_transparent_60%)] opacity-70" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col-reverse items-center gap-12 px-6 py-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full max-w-md lg:max-w-lg">
          <Card className="backdrop-blur-sm bg-white/95" contentClassName="px-8 py-10">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-gray-900">Gestionnaire NFC</h1>
              <p className="mt-2 text-sm text-gray-500">
                Connectez-vous pour suivre, prêter et maintenir vos équipements en quelques clics.
              </p>
            </div>

            <div className="flex gap-2 rounded-full bg-gray-100 p-1 text-xs font-medium text-gray-500">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 rounded-full px-3 py-1 transition ${
                  activeTab === 'login' ? 'bg-white text-gray-900 shadow-sm' : ''
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 rounded-full px-3 py-1 transition ${
                  activeTab === 'register' ? 'bg-white text-gray-900 shadow-sm' : ''
                }`}
              >
                Inscription
              </button>
            </div>

            <div className="mt-6">
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
          </Card>

          <p className="mt-6 text-center text-xs text-slate-300">
            © 2024 Gestionnaire NFC — Prototype interne
          </p>
        </div>

        <div className="w-full max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">
            Prototype interactif
          </div>
          <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">
            Centralisez le suivi de vos équipements NFC.
          </h2>
          <p className="mt-4 max-w-lg text-sm text-slate-200/90">
            Ce POC offre une vision rapide des mouvements de parc, des maintenances en cours et des tags associés. Une base solide pour préparer la mise en production.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              'Affectation rapide des tags NFC',
              'Suivi des statuts en temps réel',
              'Historique des interventions',
              'Interface claire et responsive',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-left">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/80 text-slate-900">
                  ✓
                </span>
                <span className="text-sm text-slate-100/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};