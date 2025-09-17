import { useState, useEffect, useCallback } from 'react';
import type {
  Equipment,
  EquipmentFilters,
  EquipmentStatistics,
  CreateEquipmentRequest,
  UpdateEquipmentRequest,
  ApiError,
} from '../types/api';
import equipmentService from '../services/equipmentService';

export const useEquipments = (initialFilters?: EquipmentFilters) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EquipmentFilters>(initialFilters || {});

  const clearError = () => setError(null);

  const fetchEquipments = useCallback(async (newFilters?: EquipmentFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const filtersToUse = newFilters || filters;
      const response = await equipmentService.getEquipments(filtersToUse);

      setEquipments(response.equipments);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<EquipmentFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchEquipments(updatedFilters);
  }, [filters, fetchEquipments]);

  const createEquipment = async (equipmentData: CreateEquipmentRequest): Promise<Equipment> => {
    try {
      setError(null);
      const newEquipment = await equipmentService.createEquipment(equipmentData);
      // Rafraîchir la liste
      await fetchEquipments();
      return newEquipment;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw err;
    }
  };

  const updateEquipment = async (id: string, equipmentData: UpdateEquipmentRequest): Promise<Equipment> => {
    try {
      setError(null);
      const updatedEquipment = await equipmentService.updateEquipment(id, equipmentData);
      // Mettre à jour l'équipement dans la liste locale
      setEquipments(prev => prev.map(eq => eq.id === id ? updatedEquipment : eq));
      return updatedEquipment;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw err;
    }
  };

  const deleteEquipment = async (id: string): Promise<void> => {
    try {
      setError(null);
      await equipmentService.deleteEquipment(id);
      // Supprimer l'équipement de la liste locale
      setEquipments(prev => prev.filter(eq => eq.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw err;
    }
  };

  const assignNfcTag = async (equipmentId: string, nfcTagUid: string): Promise<void> => {
    try {
      setError(null);
      const updatedEquipment = await equipmentService.assignNfcTag(equipmentId, nfcTagUid);
      setEquipments(prev => prev.map(eq => eq.id === equipmentId ? updatedEquipment : eq));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw err;
    }
  };

  const removeNfcTag = async (equipmentId: string): Promise<void> => {
    try {
      setError(null);
      const updatedEquipment = await equipmentService.removeNfcTag(equipmentId);
      setEquipments(prev => prev.map(eq => eq.id === equipmentId ? updatedEquipment : eq));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw err;
    }
  };

  // Charger les équipements au démarrage
  useEffect(() => {
    fetchEquipments();
  }, [fetchEquipments]);

  return {
    equipments,
    total,
    totalPages,
    currentPage,
    isLoading,
    error,
    filters,
    clearError,
    fetchEquipments,
    updateFilters,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    assignNfcTag,
    removeNfcTag,
  };
};

export const useEquipmentStatistics = () => {
  const [statistics, setStatistics] = useState<EquipmentStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await equipmentService.getStatistics();
      setStatistics(stats);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    isLoading,
    error,
    clearError,
    refetch: fetchStatistics,
  };
};