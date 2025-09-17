import { useState, useEffect } from 'react';
import { useNFC } from '../../hooks/useNFC';
import type { EquipmentNFCData } from '../../types/nfc';

interface NFCScannerProps {
  onEquipmentScanned?: (equipment: EquipmentNFCData) => void;
  onError?: (error: string) => void;
  autoStart?: boolean;
  className?: string;
}

/**
 * NFC Scanner component for reading equipment data from NFC tags
 * Provides a user interface for starting/stopping scans and displaying results
 */
export function NFCScanner({
  onEquipmentScanned,
  onError,
  autoStart = false,
  className = ''
}: NFCScannerProps) {
  const {
    isSupported,
    isScanning,
    lastRead,
    error,
    startScanning,
    stopScanning,
    clearLastRead,
    clearError
  } = useNFC();

  const [scanHistory, setScanHistory] = useState<EquipmentNFCData[]>([]);

  // Auto-start scanning if requested and supported
  useEffect(() => {
    if (autoStart && isSupported && !isScanning) {
      startScanning();
    }
  }, [autoStart, isSupported, isScanning, startScanning]);

  // Handle new equipment scans
  useEffect(() => {
    if (lastRead) {
      // Add to scan history
      setScanHistory(prev => {
        const exists = prev.some(item => item.equipmentId === lastRead.equipmentId);
        if (!exists) {
          return [lastRead, ...prev.slice(0, 4)]; // Keep only last 5 scans
        }
        return prev;
      });

      // Notify parent component
      if (onEquipmentScanned) {
        onEquipmentScanned(lastRead);
      }
    }
  }, [lastRead, onEquipmentScanned]);

  // Handle errors
  useEffect(() => {
    if (error && onError) {
      onError(error.message);
    }
  }, [error, onError]);

  const handleStartScan = async () => {
    clearError();
    clearLastRead();
    await startScanning();
  };

  const handleStopScan = () => {
    stopScanning();
  };

  const clearHistory = () => {
    setScanHistory([]);
    clearLastRead();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (!isSupported) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-yellow-800">NFC Not Supported</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Web NFC requires Android Chrome 89+ with HTTPS connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">NFC Scanner</h3>
              <p className="text-sm text-gray-600">
                {isScanning ? 'Scanning for NFC tags...' : 'Ready to scan equipment tags'}
              </p>
            </div>
          </div>

          {/* Scan Controls */}
          <div className="flex space-x-2">
            {!isScanning ? (
              <button
                onClick={handleStartScan}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Start Scan
              </button>
            ) : (
              <button
                onClick={handleStopScan}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Stop Scan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scanning Status */}
      {isScanning && (
        <div className="p-6 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Scanning for NFC tags...</p>
              <p className="text-sm text-blue-600">Hold your device near an NFC tag to read it.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-6 bg-red-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800">Scan Error</h4>
              <p className="text-sm text-red-700">{error.message}</p>
            </div>
            <button
              onClick={clearError}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Last Scanned Equipment */}
      {lastRead && (
        <div className="p-6 bg-green-50 border-b border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-green-800">{lastRead.name}</h4>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-green-700">
                  <span className="font-medium">ID:</span> {lastRead.equipmentId}
                </p>
                <p className="text-sm text-green-700">
                  <span className="font-medium">Category:</span> {lastRead.category}
                </p>
                {lastRead.location && (
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Location:</span> {lastRead.location}
                  </p>
                )}
                <p className="text-sm text-green-700">
                  <span className="font-medium">Last Updated:</span> {formatDate(lastRead.lastUpdated)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Recent Scans</h4>
            <button
              onClick={clearHistory}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear History
            </button>
          </div>

          <div className="space-y-3">
            {scanHistory.map((equipment, index) => (
              <div
                key={`${equipment.equipmentId}-${index}`}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md"
              >
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {equipment.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {equipment.category} • {equipment.equipmentId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isScanning && !lastRead && (
        <div className="p-6 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
          <p className="text-sm text-gray-600 mb-4">
            Click "Start Scan" to begin reading NFC tags
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Make sure NFC is enabled on your device</p>
            <p>• Hold your device close to the NFC tag</p>
            <p>• Keep the device steady until the scan completes</p>
          </div>
        </div>
      )}
    </div>
  );
}