import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiError } from '../types/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token JWT
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Intercepteur pour gérer les erreurs
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          // Rediriger vers login si pas déjà sur la page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }

        const apiError: ApiError = {
          message:
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message,
          code: error.response?.data?.code,
          errors: error.response?.data?.errors,
          action: error.response?.data?.action,
          details: error.response?.data?.details,
        };

        return Promise.reject(apiError);
      }
    );

    // Récupérer le token du localStorage au démarrage
    this.token = localStorage.getItem('authToken');
  }

  private extractResponse<T>(payload: any): T {
    if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
      return payload.data as T;
    }

    return payload as T;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Méthodes HTTP génériques
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, { params });
    return this.extractResponse<T>(response.data);
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data);
    return this.extractResponse<T>(response.data);
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data);
    return this.extractResponse<T>(response.data);
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url);
    return this.extractResponse<T>(response.data);
  }
}

// Instance singleton
const apiClient = new ApiClient();
export default apiClient;