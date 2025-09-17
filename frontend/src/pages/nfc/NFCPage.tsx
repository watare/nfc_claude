import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NFCSupport } from '../../components/nfc/NFCSupport';
import { NFCScanner } from '../../components/nfc/NFCScanner';
import { NFCWriter } from '../../components/nfc/NFCWriter';
import { useEquipments } from '../../hooks/useEquipments';
import type { Equipment } from '../../types/api';
import type { EquipmentNFCData } from '../../types/nfc';

/**
 * NFC management page
 * Provides interface for scanning and writing NFC tags for equipment
 */
export function NFCPage() {
  const navigate = useNavigate();
  const { equipments } = useEquipments();

  const [activeTab, setActiveTab] = useState<'scan' | 'write'>('scan');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [scannedEquipment, setScannedEquipment] = useState<EquipmentNFCData | null>(null);
  const [isNFCSupported, setIsNFCSupported] = useState(false);

  // Clear scanned equipment when switching tabs
  useEffect(() => {
    setScannedEquipment(null);
  }, [activeTab]);

  const handleEquipmentScanned = (equipment: EquipmentNFCData) => {
    setScannedEquipment(equipment);
  };

  const handleViewEquipment = () => {
    if (scannedEquipment) {
      navigate(`/equipments/${scannedEquipment.equipmentId}`);
    }
  };

  const handleWriteComplete = (success: boolean) => {
    if (success) {
      // Optionally switch to scan tab to test the written tag
      setActiveTab('scan');
    }
  };

  const tabs = [
    {
      id: 'scan' as const,
      name: 'Scan Tags',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      description: 'Read equipment data from NFC tags'
    },
    {
      id: 'write' as const,
      name: 'Write Tags',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      description: 'Write equipment data to NFC tags'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">NFC Management</h1>
        <p className="mt-2 text-gray-600">
          Scan and write NFC tags for equipment identification and tracking.
        </p>
      </div>

      {/* NFC Support Status */}
      <div className="mb-8">
        <NFCSupport
          onSupportChange={setIsNFCSupported}
          showDetails={!isNFCSupported}
          className={isNFCSupported ? '' : 'mb-8'}
        />
      </div>

      {isNFCSupported && (
        <>
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Description */}
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'scan' && (
                <NFCScanner
                  onEquipmentScanned={handleEquipmentScanned}
                  className="h-fit"
                />
              )}

              {activeTab === 'write' && (
                <NFCWriter
                  equipment={selectedEquipment}
                  onWriteComplete={handleWriteComplete}
                  className="h-fit"
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Scanned Equipment Details */}
              {activeTab === 'scan' && scannedEquipment && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Scanned Equipment</h3>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Name:</span>
                      <p className="text-sm text-gray-900">{scannedEquipment.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">ID:</span>
                      <p className="text-sm text-gray-900">{scannedEquipment.equipmentId}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Category:</span>
                      <p className="text-sm text-gray-900">{scannedEquipment.category}</p>
                    </div>
                    {scannedEquipment.location && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Location:</span>
                        <p className="text-sm text-gray-900">{scannedEquipment.location}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-700">Last Updated:</span>
                      <p className="text-sm text-gray-900">
                        {new Date(scannedEquipment.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleViewEquipment}
                    className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              )}

              {/* Equipment Selection for Writing */}
              {activeTab === 'write' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Equipment</h3>

                  {equipments.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="text-sm text-gray-600">No equipment available</p>
                      <button
                        onClick={() => navigate('/equipments/new')}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                      >
                        Create equipment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {equipments.map((equipment) => (
                        <div
                          key={equipment.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedEquipment?.id === equipment.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedEquipment(equipment)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedEquipment?.id === equipment.id
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedEquipment?.id === equipment.id && (
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {equipment.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {equipment.category} • {equipment.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* NFC Tips */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">NFC Tips</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Keep your device close to the NFC tag (within 4cm)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Hold steady until the operation completes</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Remove phone cases that might interfere</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Make sure NFC is enabled in device settings</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Writing will overwrite existing tag data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}