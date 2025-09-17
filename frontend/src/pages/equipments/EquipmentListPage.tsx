import React from 'react';
import { Link } from 'react-router-dom';
import { useEquipments } from '../../hooks/useEquipments';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const statusLabels = {
  IN_SERVICE: 'En service',
  OUT_OF_SERVICE: 'Hors service',
  MAINTENANCE: 'Maintenance',
  RETIRED: 'Retiré',
};

const statusColors = {
  IN_SERVICE: 'bg-green-100 text-green-800',
  OUT_OF_SERVICE: 'bg-red-100 text-red-800',
  MAINTENANCE: 'bg-yellow-100 text-yellow-800',
  RETIRED: 'bg-gray-100 text-gray-800',
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Équipements</h1>
          <p className="text-gray-600">{total} équipement(s) au total</p>
        </div>
        <Link to="/equipments/new">
          <Button variant="primary">
            Ajouter équipement
          </Button>
        </Link>
      </div>

      {/* Liste des équipements */}
      <Card>
        {equipments.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📦</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun équipement
            </h3>
            <p className="text-gray-600 mb-4">
              Commencez par ajouter votre premier équipement.
            </p>
            <Link to="/equipments/new">
              <Button variant="primary">
                Ajouter équipement
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                  <tr key={equipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {equipment.name}
                        </div>
                        {equipment.serialNumber && (
                          <div className="text-sm text-gray-500">
                            S/N: {equipment.serialNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipment.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[equipment.status]}`}>
                        {statusLabels[equipment.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipment.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipment.nfcTagId ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          📱 Assigné
                        </span>
                      ) : (
                        <span className="text-gray-400">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/equipments/${equipment.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Détails
                      </Link>
                      <Link
                        to={`/equipments/${equipment.id}/edit`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Modifier
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