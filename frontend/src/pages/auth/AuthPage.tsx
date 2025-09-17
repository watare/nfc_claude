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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestionnaire NFC
          </h1>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          Gestion d'équipements avec technologie NFC
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
        </Card>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          © 2024 Gestionnaire NFC - Prototype de démonstration
        </p>
      </div>
    </div>
  );
};