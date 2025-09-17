// Types partagés avec le backend
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  status: 'IN_SERVICE' | 'OUT_OF_SERVICE' | 'MAINTENANCE' | 'RETIRED';
  location: string;
  description?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyEndDate?: string;
  nfcTagId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  nfcTag?: NfcTag;
  events?: EquipmentEvent[];
}

export interface NfcTag {
  id: string;
  uid: string;
  equipmentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentEvent {
  id: string;
  equipmentId: string;
  type: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'LOCATION_CHANGED' | 'NFC_TAG_ASSIGNED' | 'NFC_TAG_REMOVED';
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
  createdBy: string;
  user?: User;
}

export interface EquipmentStatistics {
  total: number;
  inService: number;
  outOfService: number;
  maintenance: number;
  retired: number;
  byCategory: Record<string, number>;
  byLocation: Record<string, number>;
}

// Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateEquipmentRequest {
  name: string;
  category: string;
  status: Equipment['status'];
  location: string;
  description?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyEndDate?: string;
}

export interface UpdateEquipmentRequest extends Partial<CreateEquipmentRequest> {}

export interface EquipmentListResponse {
  equipments: Equipment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EquipmentFilters {
  search?: string;
  category?: string;
  status?: Equipment['status'];
  location?: string;
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}