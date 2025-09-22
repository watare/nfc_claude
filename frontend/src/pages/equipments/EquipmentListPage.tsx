import React from 'react';
import { Link } from 'react-router-dom';
import { useEquipments } from '../../hooks/useEquipments';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const statusLabels: Record<string, string> = {
  IN_SERVICE: 'En service',
  OUT_OF_SERVICE: 'Hors service',
  MAINTENANCE: 'Maintenance',
  LOANED: 'En prêt',
};

const statusClasses: Record<string, string> = {
  IN_SERVICE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  OUT_OF_SERVICE: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  MAINTENANCE: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  LOANED: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
};

export const EquipmentListPage: React.FC = () => {
  const { equipments, isLoading, error, total } = useEquipments();

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
        Erreur lors du chargement des équipements: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Inventaire</p>
          <h1 className="text-3xl font-semibold text-gray-900">Équipements</h1>
          <p className="text-sm text-gray-600">
            {total} équipement{total > 1 ? 's' : ''} suivis dans le parc
          </p>
        </div>
        <Link to="/equipments/new" className="md:self-start">
          <Button variant="primary">
            Ajouter un équipement
          </Button>
        </Link>
      </div>

      {/* Liste des équipements */}
      <Card className="overflow-hidden" contentClassName="p-0">
        {equipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-gray-300">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 opacity-70" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Aucun équipement pour le moment</h3>
              <p className="mt-1 text-sm text-gray-600">
                Ajoutez votre premier équipement pour lancer le suivi NFC.
              </p>
            </div>
            <Link to="/equipments/new">
              <Button variant="primary">
                Ajouter un équipement
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tag NFC
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {equipments.map((equipment) => (
                  <tr key={equipment.id} className="hover:bg-gray-50/70">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {equipment.name}
                        </span>
                        {equipment.serialNumber && (
                          <span className="text-xs uppercase tracking-wide text-gray-500">
                            S/N&nbsp;{equipment.serialNumber}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
                        {equipment.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                          statusClasses[equipment.status] || 'bg-gray-50 text-gray-700 ring-gray-200'
                        }`}
                      >
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-current opacity-75" />
                        {statusLabels[equipment.status] ?? equipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipment.location ? (
                        <span className="font-medium text-gray-800">{equipment.location}</span>
                      ) : (
                        <span className="text-gray-400">Non renseigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipment.tag ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
                          <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
                          {equipment.tag.tagId}
                        </span>
                      ) : (
                        <span className="text-gray-400">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/equipments/${equipment.id}`}
                        className="text-blue-600 transition hover:text-blue-800"
                      >
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};