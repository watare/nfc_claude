// User types
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'ADMIN' | 'USER';

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  firstName: string;
  lastName: string;
}

export interface UserProfile extends Omit<User, 'password'> {}

// Equipment types
export interface Equipment {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: EquipmentStatus;
  location?: string;
  notes?: string;
  tagId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EquipmentStatus = 'IN_SERVICE' | 'OUT_OF_SERVICE' | 'MAINTENANCE' | 'LOANED';

export interface CreateEquipmentRequest {
  name: string;
  description?: string;
  category: string;
  status: EquipmentStatus;
  location?: string;
  notes?: string;
}

export interface UpdateEquipmentRequest extends Partial<CreateEquipmentRequest> {}

// NFC Tag types
export interface NfcTag {
  id: string;
  tagId: string;
  equipmentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignTagRequest {
  tagId: string;
  equipmentId: string;
}

// Event types
export interface EquipmentEvent {
  id: string;
  equipmentId: string;
  type: EventType;
  description?: string;
  userId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type EventType = 'LOAN' | 'RETURN' | 'MAINTENANCE_START' | 'MAINTENANCE_END' | 'STATUS_CHANGE' | 'TAG_ASSIGNED' | 'TAG_REMOVED';

export interface CreateEventRequest {
  equipmentId: string;
  type: EventType;
  description?: string;
  metadata?: Record<string, unknown>;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// JWT types
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Request with user
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Filter and query types
export interface EquipmentFilters {
  category?: string;
  status?: EquipmentStatus;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EventFilters {
  equipmentId?: string;
  type?: EventType;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}