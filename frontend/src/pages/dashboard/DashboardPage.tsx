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
      title: 'En service',
      value: statistics?.byStatus?.IN_SERVICE ?? 0,
      accent: 'from-emerald-500/80 to-emerald-400/60',
    },
    {
      title: 'Hors service',
      value: statistics?.byStatus?.OUT_OF_SERVICE ?? 0,
      accent: 'from-rose-500/80 to-rose-400/60',
    },
    {
      title: 'En maintenance',
      value: statistics?.byStatus?.MAINTENANCE ?? 0,
      accent: 'from-amber-500/80 to-amber-400/60',
    },
    {
      title: 'Prêtés',
      value: statistics?.byStatus?.LOANED ?? 0,
      accent: 'from-indigo-500/80 to-indigo-400/60',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Synthèse</p>
          <h1 className="text-3xl font-semibold text-gray-900">Tableau de bord</h1>
        </div>
        <div className="flex flex-wrap gap-3">
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-white/70">Total équipements</p>
            <p className="text-4xl font-semibold">{statistics?.totalEquipments ?? 0}</p>
            <p className="text-sm text-white/70">
              Parc suivi via les puces NFC
            </p>
          </div>
        </Card>
        {statusCards.map((card) => (
          <Card key={card.title} className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{card.value}</p>
              </div>
              <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${card.accent} opacity-70 blur-sm`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Répartition par catégorie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Répartition par catégorie">
          {statistics?.byCategory?.length ? (
            <div className="space-y-4">
              {statistics.byCategory.map(({ category, count }) => (
                <div key={category} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{category}</p>
                    <p className="text-xs text-gray-500">{count} équipement{count > 1 ? 's' : ''}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune donnée disponible</p>
          )}
        </Card>

        <Card title="Activité récente">
          {statistics?.recentActivity?.length ? (
            <div className="space-y-4">
              {statistics.recentActivity.map((event) => (
                <div key={event.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{event.equipment.name}</p>
                    <p className="text-xs text-gray-500">{event.description ?? 'Mise à jour'}</p>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-gray-400">
                    {new Date(event.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune activité récente</p>
          )}
        </Card>
      </div>

      {/* Actions rapides */}
      <Card title="Actions rapides">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[{
            title: 'Équipements hors service',
            description: 'Identifier les équipements à remplacer',
            to: '/equipments?status=OUT_OF_SERVICE',
          }, {
            title: 'Suivi maintenance',
            description: 'Planifier les interventions à venir',
            to: '/equipments?status=MAINTENANCE',
          }, {
            title: 'Exporter le parc',
            description: 'Télécharger le fichier CSV consolidé',
            to: '/equipments/export',
          }, {
            title: 'Console NFC',
            description: 'Scanner et affecter de nouveaux tags',
            to: '/nfc',
          }].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group rounded-xl border border-gray-200 bg-white/60 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
            >
              <h3 className="text-sm font-semibold text-gray-900">{action.title}</h3>
              <p className="mt-2 text-sm text-gray-600 group-hover:text-gray-700">{action.description}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};