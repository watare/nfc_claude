import axios from 'axios';
import apiClient from './api';
import type {
  Equipment,
  EquipmentListResponse,
  CreateEquipmentRequest,
  UpdateEquipmentRequest,
  EquipmentFilters,
  EquipmentStatistics,
} from '../types/api';

export class EquipmentService {
  async getEquipments(filters?: EquipmentFilters): Promise<EquipmentListResponse> {
    return await apiClient.get<EquipmentListResponse>('/equipments', filters);
  }

  async getEquipmentById(id: string): Promise<Equipment> {
    return await apiClient.get<Equipment>(`/equipments/${id}`);
  }

  async createEquipment(equipment: CreateEquipmentRequest): Promise<Equipment> {
    return await apiClient.post<Equipment>('/equipments', equipment);
  }

  async updateEquipment(id: string, equipment: UpdateEquipmentRequest): Promise<Equipment> {
    return await apiClient.put<Equipment>(`/equipments/${id}`, equipment);
  }

  async deleteEquipment(id: string): Promise<void> {
    await apiClient.delete(`/equipments/${id}`);
  }

  async getStatistics(): Promise<EquipmentStatistics> {
    return await apiClient.get<EquipmentStatistics>('/equipments/statistics');
  }

  async exportToCsv(filters?: EquipmentFilters): Promise<Blob> {
    const response = await axios.get('/api/equipments/export', {
      params: filters,
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${apiClient.getToken()}`,
      },
    });
    return response.data;
  }

  async assignNfcTag(equipmentId: string, tagId: string): Promise<Equipment> {
    return await apiClient.post<Equipment>(`/equipments/${equipmentId}/nfc-tag`, {
      tagId,
    });
  }

  async removeNfcTag(equipmentId: string): Promise<Equipment> {
    return await apiClient.delete<Equipment>(`/equipments/${equipmentId}/nfc-tag`);
  }
}

const equipmentService = new EquipmentService();
export default equipmentService;