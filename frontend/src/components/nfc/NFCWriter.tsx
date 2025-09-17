import { useState } from 'react';
import { useNFC } from '../../hooks/useNFC';
import type { EquipmentNFCData } from '../../types/nfc';
import type { Equipment } from '../../types/api';

interface NFCWriterProps {
  equipment?: Equipment | null;
  onWriteComplete?: (success: boolean, equipment: EquipmentNFCData) => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * NFC Writer component for writing equipment data to NFC tags
 * Provides interface for writing equipment information to tags
 */
export function NFCWriter({
  equipment,
  onWriteComplete,
  onError,
  className = ''
}: NFCWriterProps) {
  const {
    isSupported,
    isWriting,
    error,
    writeEquipmentToTag,
    clearError
  } = useNFC();

  const [writeStatus, setWriteStatus] = useState<'idle' | 'ready' | 'success' | 'error'>('idle');
  const [lastWritten, setLastWritten] = useState<EquipmentNFCData | null>(null);

  const prepareEquipmentData = (eq: Equipment): EquipmentNFCData => {
    return {
      equipmentId: eq.id,
      name: eq.name,
      category: eq.category,
      location: eq.location || undefined,
      lastUpdated: new Date().toISOString()
    };
  };

  const handleWriteTag = async () => {
    if (!equipment) return;

    clearError();
    setWriteStatus('ready');

    const equipmentData = prepareEquipmentData(equipment);

    try {
      const success = await writeEquipmentToTag(equipmentData);

      if (success) {
        setWriteStatus('success');
        setLastWritten(equipmentData);

        if (onWriteComplete) {
          onWriteComplete(true, equipmentData);
        }
      } else {
        setWriteStatus('error');
        if (onError) {
          onError('Failed to write to NFC tag');
        }
      }
    } catch (err) {
      setWriteStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const resetStatus = () => {
    setWriteStatus('idle');
    setLastWritten(null);
    clearError();
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
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">NFC Writer</h3>
            <p className="text-sm text-gray-600">
              Write equipment data to NFC tags
            </p>
          </div>
        </div>
      </div>

      {/* Equipment Info */}
      {equipment && (
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Equipment to Write</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Name:</span>
                <p className="text-sm text-gray-900">{equipment.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">ID:</span>
                <p className="text-sm text-gray-900">{equipment.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Category:</span>
                <p className="text-sm text-gray-900">{equipment.category}</p>
              </div>
              {equipment.location && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Location:</span>
                  <p className="text-sm text-gray-900">{equipment.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Write Status */}
      {writeStatus === 'ready' && isWriting && (
        <div className="p-6 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Writing to NFC tag...</p>
              <p className="text-sm text-blue-600">Hold your device near the NFC tag until writing completes.</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Status */}
      {writeStatus === 'success' && lastWritten && (
        <div className="p-6 bg-green-50 border-b border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-800">Successfully Written!</h4>
              <p className="text-sm text-green-700 mt-1">
                Equipment data has been written to the NFC tag.
              </p>
              <div className="mt-3 text-xs text-green-600 bg-green-100 rounded p-2">
                <p><strong>Written Data:</strong></p>
                <p>• Equipment: {lastWritten.name}</p>
                <p>• ID: {lastWritten.equipmentId}</p>
                <p>• Category: {lastWritten.category}</p>
                {lastWritten.location && <p>• Location: {lastWritten.location}</p>}
                <p>• Timestamp: {new Date(lastWritten.lastUpdated).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Status */}
      {(error || writeStatus === 'error') && (
        <div className="p-6 bg-red-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">Write Failed</h4>
              <p className="text-sm text-red-700">
                {error?.message || 'Failed to write to NFC tag'}
              </p>
            </div>
            <button
              onClick={resetStatus}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-6">
        <div className="flex space-x-3">
          {equipment && writeStatus !== 'success' && (
            <button
              onClick={handleWriteTag}
              disabled={isWriting || !equipment}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isWriting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Writing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Write to NFC Tag
                </>
              )}
            </button>
          )}

          {writeStatus === 'success' && (
            <button
              onClick={resetStatus}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Write Another Tag
            </button>
          )}
        </div>

        {/* Instructions */}
        {!equipment && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Select an equipment item to write its data to an NFC tag.
            </p>
          </div>
        )}

        {equipment && writeStatus === 'idle' && (
          <div className="mt-4 text-center text-xs text-gray-500 space-y-1">
            <p>• Make sure NFC is enabled on your device</p>
            <p>• Place a blank NFC tag near your device</p>
            <p>• Keep the device steady during writing</p>
            <p>• Writing will overwrite any existing data on the tag</p>
          </div>
        )}
      </div>
    </div>
  );
}