import { useCallback, useEffect, useReducer, useRef } from 'react';
import type {
  NDEFReader,
  NDEFMessage,
  NDEFReadingEvent,
  NFCState,
  NFCAction,
  EquipmentNFCData
} from '../types/nfc';

// Initial state for NFC
const initialState: NFCState = {
  isSupported: false,
  isScanning: false,
  isWriting: false,
  lastRead: null,
  error: null,
  permissions: null,
};

// Reducer for managing NFC state
function nfcReducer(state: NFCState, action: NFCAction): NFCState {
  switch (action.type) {
    case 'SET_SUPPORTED':
      return { ...state, isSupported: action.payload };
    case 'SET_SCANNING':
      return { ...state, isScanning: action.payload };
    case 'SET_WRITING':
      return { ...state, isWriting: action.payload };
    case 'SET_LAST_READ':
      return { ...state, lastRead: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PERMISSIONS':
      return { ...state, permissions: action.payload };
    case 'RESET_STATE':
      return { ...initialState, isSupported: state.isSupported };
    default:
      return state;
  }
}

/**
 * Custom hook for Web NFC API integration
 * Provides functionality to read and write NFC tags with equipment data
 *
 * Requirements:
 * - HTTPS connection (required by Web NFC API)
 * - Android Chrome 89+ (only supported browser)
 * - User permission for NFC access
 */
export function useNFC() {
  const [state, dispatch] = useReducer(nfcReducer, initialState);
  const readerRef = useRef<NDEFReader | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check if NFC is supported by the browser
  const checkNFCSupport = useCallback(async () => {
    // Check if NDEFReader is available
    const isNDEFSupported = 'NDEFReader' in window;

    // Check if we're in a secure context (HTTPS)
    const isSecureContext = window.isSecureContext;

    // Check if navigator.permissions is available for permission checking
    const hasPermissionsAPI = 'permissions' in navigator;

    const isSupported = isNDEFSupported && isSecureContext;
    dispatch({ type: 'SET_SUPPORTED', payload: isSupported });

    // Check permissions if available
    if (hasPermissionsAPI && isSupported) {
      try {
        // Note: 'nfc' permission is not yet standardized, fallback gracefully
        const permission = await navigator.permissions.query({ name: 'nfc' as PermissionName });
        dispatch({ type: 'SET_PERMISSIONS', payload: permission.state });

        // Listen for permission changes
        permission.onchange = () => {
          dispatch({ type: 'SET_PERMISSIONS', payload: permission.state });
        };
      } catch (error) {
        // Permission query not supported, but NFC might still work
        console.warn('NFC permission query not supported:', error);
      }
    }

    return isSupported;
  }, []);

  // Initialize NFC reader
  const initializeReader = useCallback(() => {
    if (!window.NDEFReader) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          name: 'NotSupportedError',
          message: 'Web NFC is not supported by this browser'
        }
      });
      return null;
    }

    if (!window.isSecureContext) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          name: 'SecurityError',
          message: 'Web NFC requires HTTPS connection'
        }
      });
      return null;
    }

    try {
      const reader = new window.NDEFReader();
      readerRef.current = reader;

      // Set up event handlers
      reader.onreading = (event: NDEFReadingEvent) => {
        handleNFCRead(event);
      };

      reader.onreadingerror = (event: Event) => {
        dispatch({
          type: 'SET_ERROR',
          payload: {
            name: 'ReadError',
            message: 'Failed to read NFC tag'
          }
        });
        console.error('NFC reading error:', event);
      };

      return reader;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          name: 'InitializationError',
          message: error instanceof Error ? error.message : 'Failed to initialize NFC reader'
        }
      });
      return null;
    }
  }, []);

  // Handle NFC tag read
  const handleNFCRead = useCallback((event: NDEFReadingEvent) => {
    try {
      console.log('NFC tag detected:', event.serialNumber);

      // Clear any previous errors
      dispatch({ type: 'SET_ERROR', payload: null });

      // Process NDEF records
      for (const record of event.message.records) {
        if (record.recordType === 'text' || record.recordType === 'application/json') {
          let data: string;

          if (record.data) {
            const decoder = new TextDecoder(record.encoding || 'utf-8');
            data = decoder.decode(record.data);
          } else {
            continue;
          }

          // Try to parse as equipment data
          try {
            const equipmentData: EquipmentNFCData = JSON.parse(data);

            // Validate equipment data structure
            if (equipmentData.equipmentId && equipmentData.name) {
              dispatch({ type: 'SET_LAST_READ', payload: equipmentData });
              console.log('Equipment data read:', equipmentData);
              return;
            }
          } catch (parseError) {
            // If JSON parsing fails, treat as plain text
            console.log('Plain text data read:', data);
          }
        }
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          name: 'ProcessingError',
          message: 'Failed to process NFC tag data'
        }
      });
      console.error('Error processing NFC read:', error);
    }
  }, []);

  // Start scanning for NFC tags
  const startScanning = useCallback(async () => {
    if (state.isScanning) return;

    const reader = readerRef.current || initializeReader();
    if (!reader) return;

    try {
      // Create abort controller for this scan session
      abortControllerRef.current = new AbortController();

      dispatch({ type: 'SET_SCANNING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      await reader.scan({ signal: abortControllerRef.current.signal });
      console.log('NFC scanning started');
    } catch (error) {
      dispatch({ type: 'SET_SCANNING', payload: false });

      if (error instanceof Error) {
        dispatch({
          type: 'SET_ERROR',
          payload: {
            name: error.name,
            message: error.message
          }
        });
      }
      console.error('Failed to start NFC scanning:', error);
    }
  }, [state.isScanning, initializeReader]);

  // Stop scanning for NFC tags
  const stopScanning = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    dispatch({ type: 'SET_SCANNING', payload: false });
    console.log('NFC scanning stopped');
  }, []);

  // Write equipment data to NFC tag
  const writeEquipmentToTag = useCallback(async (equipmentData: EquipmentNFCData) => {
    const reader = readerRef.current || initializeReader();
    if (!reader) return false;

    if (state.isWriting) return false;

    try {
      dispatch({ type: 'SET_WRITING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Create NDEF message with equipment data
      const message: NDEFMessage = {
        records: [{
          recordType: 'text',
          data: new TextEncoder().encode(JSON.stringify(equipmentData)),
          encoding: 'utf-8',
          lang: 'en'
        }]
      };

      // Create abort controller for write operation
      const abortController = new AbortController();

      // Set timeout for write operation (10 seconds)
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, 10000);

      await reader.write(message, {
        overwrite: true,
        signal: abortController.signal
      });

      clearTimeout(timeoutId);
      dispatch({ type: 'SET_WRITING', payload: false });

      console.log('Equipment data written to NFC tag:', equipmentData);
      return true;
    } catch (error) {
      dispatch({ type: 'SET_WRITING', payload: false });

      if (error instanceof Error) {
        dispatch({
          type: 'SET_ERROR',
          payload: {
            name: error.name,
            message: error.message
          }
        });
      }
      console.error('Failed to write to NFC tag:', error);
      return false;
    }
  }, [state.isWriting, initializeReader]);

  // Clear the last read data
  const clearLastRead = useCallback(() => {
    dispatch({ type: 'SET_LAST_READ', payload: null });
  }, []);

  // Clear any errors
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Reset all NFC state
  const resetNFCState = useCallback(() => {
    stopScanning();
    dispatch({ type: 'RESET_STATE' });
  }, [stopScanning]);

  // Initialize NFC support check on mount
  useEffect(() => {
    checkNFCSupport();
  }, [checkNFCSupport]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return {
    // State
    isSupported: state.isSupported,
    isScanning: state.isScanning,
    isWriting: state.isWriting,
    lastRead: state.lastRead,
    error: state.error,
    permissions: state.permissions,

    // Actions
    startScanning,
    stopScanning,
    writeEquipmentToTag,
    clearLastRead,
    clearError,
    resetNFCState,
    checkNFCSupport,
  };
}