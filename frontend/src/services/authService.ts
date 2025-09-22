import apiClient from './api';
import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../types/api';

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    apiClient.setToken(response.token);
    return response;
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/register', userData);
    apiClient.setToken(response.token);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return await apiClient.get<User>('/auth/me');
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return await apiClient.put<User>('/auth/me', userData);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.clearToken();
    }
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  getToken(): string | null {
    return apiClient.getToken();
  }
}

const authService = new AuthService();
export default authService;