// Types partagés avec le backend
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EquipmentStatus = 'IN_SERVICE' | 'OUT_OF_SERVICE' | 'MAINTENANCE' | 'LOANED';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  status: EquipmentStatus;
  location?: string;
  description?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyEndDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  notes?: string;
  tag?: NfcTag | null;
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count?: {
    events: number;
  };
}

export interface NfcTag {
  id: string;
  tagId: string;
  equipmentId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentEvent {
  id: string;
  equipmentId: string;
  type: 'LOAN' | 'RETURN' | 'MAINTENANCE_START' | 'MAINTENANCE_END' | 'STATUS_CHANGE' | 'TAG_ASSIGNED' | 'TAG_REMOVED';
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
  createdBy: string;
  user?: User;
}

export interface EquipmentStatistics {
  totalEquipments: number;
  byStatus: Record<string, number>;
  byCategory: Array<{ category: string; count: number }>;
  recentActivity: Array<{
    id: string;
    type: EquipmentEvent['type'];
    description: string | null;
    createdAt: string;
    equipment: { id: string; name: string };
    user: { id: string; firstName: string; lastName: string };
  }>;
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
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
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
  action?: string;
  details?: Record<string, unknown>;
}