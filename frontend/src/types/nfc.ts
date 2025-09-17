// Web NFC API Types
// Based on W3C Web NFC API specification

export interface NDEFMessage {
  records: NDEFRecord[];
}

export interface NDEFRecord {
  recordType: string;
  mediaType?: string;
  id?: string;
  data?: BufferSource;
  encoding?: string;
  lang?: string;
}

export interface NDEFReadingEvent extends Event {
  serialNumber: string;
  message: NDEFMessage;
}

export interface NDEFWriteOptions {
  overwrite?: boolean;
  signal?: AbortSignal;
}

export interface NDEFScanOptions {
  signal?: AbortSignal;
}

export interface NDEFReader extends EventTarget {
  onreading: ((this: NDEFReader, ev: NDEFReadingEvent) => any) | null;
  onreadingerror: ((this: NDEFReader, ev: Event) => any) | null;
  scan(options?: NDEFScanOptions): Promise<void>;
  write(message: NDEFMessage | string, options?: NDEFWriteOptions): Promise<void>;
}

export interface NDEFReaderConstructor {
  new (): NDEFReader;
}

// Extend Window interface to include NDEFReader
declare global {
  interface Window {
    NDEFReader?: NDEFReaderConstructor;
  }
}

// NFC-related types for our application
export interface EquipmentNFCData {
  equipmentId: string;
  name: string;
  category: string;
  location?: string;
  lastUpdated: string;
}

export interface NFCError {
  name: string;
  message: string;
  code?: string;
}

export interface NFCState {
  isSupported: boolean;
  isScanning: boolean;
  isWriting: boolean;
  lastRead: EquipmentNFCData | null;
  error: NFCError | null;
  permissions: PermissionState | null;
}

export type NFCAction =
  | { type: 'SET_SUPPORTED'; payload: boolean }
  | { type: 'SET_SCANNING'; payload: boolean }
  | { type: 'SET_WRITING'; payload: boolean }
  | { type: 'SET_LAST_READ'; payload: EquipmentNFCData | null }
  | { type: 'SET_ERROR'; payload: NFCError | null }
  | { type: 'SET_PERMISSIONS'; payload: PermissionState | null }
  | { type: 'RESET_STATE' };