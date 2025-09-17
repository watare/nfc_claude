import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from './Button';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Tableau de bord' },
    { path: '/equipments', label: 'Équipements' },
    { path: '/nfc', label: 'NFC' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo et navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="text-xl font-bold text-blue-600">
                  Gestionnaire NFC
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(item.path)
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Profil utilisateur */}
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-gray-500">
                  {user?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation mobile */}
        <div className="sm:hidden border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};