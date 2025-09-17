import React from 'react';
import { Link } from 'react-router-dom';
import { useEquipmentStatistics } from '../../hooks/useEquipments';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const DashboardPage: React.FC = () => {
  const { statistics, isLoading, error } = useEquipmentStatistics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Erreur lors du chargement des statistiques: {error}
      </div>
    );
  }

  const statusCards = [
    {
      title: 'Total Équipements',
      value: statistics?.total || 0,
      color: 'bg-blue-600',
      icon: '📦',
    },
    {
      title: 'En Service',
      value: statistics?.inService || 0,
      color: 'bg-green-600',
      icon: '✅',
    },
    {
      title: 'Hors Service',
      value: statistics?.outOfService || 0,
      color: 'bg-red-600',
      icon: '❌',
    },
    {
      title: 'Maintenance',
      value: statistics?.maintenance || 0,
      color: 'bg-yellow-600',
      icon: '🔧',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <div className="flex space-x-3">
          <Link to="/equipments">
            <Button variant="secondary">
              Voir tous les équipements
            </Button>
          </Link>
          <Link to="/equipments/new">
            <Button variant="primary">
              Ajouter équipement
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((card) => (
          <Card key={card.title} className="text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className={`p-3 rounded-full ${card.color} text-white`}>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-600">{card.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Répartition par catégorie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Répartition par catégorie">
          {statistics?.byCategory ? (
            <div className="space-y-3">
              {Object.entries(statistics.byCategory).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <span className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune donnée disponible</p>
          )}
        </Card>

        <Card title="Répartition par localisation">
          {statistics?.byLocation ? (
            <div className="space-y-3">
              {Object.entries(statistics.byLocation).map(([location, count]) => (
                <div key={location} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{location}</span>
                  <span className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune donnée disponible</p>
          )}
        </Card>
      </div>

      {/* Actions rapides */}
      <Card title="Actions rapides">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/equipments?status=OUT_OF_SERVICE"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-medium text-gray-900">Équipements défaillants</h3>
                <p className="text-sm text-gray-600">Voir les équipements hors service</p>
              </div>
            </div>
          </Link>

          <Link
            to="/equipments?status=MAINTENANCE"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔧</span>
              <div>
                <h3 className="font-medium text-gray-900">Maintenance</h3>
                <p className="text-sm text-gray-600">Équipements en maintenance</p>
              </div>
            </div>
          </Link>

          <Link
            to="/equipments/export"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-medium text-gray-900">Export CSV</h3>
                <p className="text-sm text-gray-600">Télécharger les données</p>
              </div>
            </div>
          </Link>

          <Link
            to="/nfc"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📱</span>
              <div>
                <h3 className="font-medium text-gray-900">Scanner NFC</h3>
                <p className="text-sm text-gray-600">Lire et écrire des tags NFC</p>
              </div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};