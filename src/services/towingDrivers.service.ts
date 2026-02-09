import api from '@/lib/api';

// ============================================
// INTERFACES
// ============================================

export interface UF {
  id: number;
  code: string;
  name: string;
}

export interface TowingProvider {
  id: number;
  fantasy_name: string;
}

export interface TowingSettings {
  id: number;
  excess_km_price: number;
  departure_price: number;
}

export interface TowingDriver {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  status: 'available' | 'in_service' | 'banned';
  towing_provider: TowingProvider;
  total_calls: number;
  uf: UF | null;
  towing_settings: TowingSettings | null;
  created_at: string;
}

export interface PaginationMeta {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface TowingDriversResponse {
  data: TowingDriver[];
  pagination: PaginationMeta;
}

// ============================================
// SERVICE
// ============================================

export const towingDriversService = {
  /**
   * GET /api/towing-drivers
   * Lista todos os motoristas de guincho com paginação
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    uf_id?: number;
  }): Promise<TowingDriversResponse> => {
    const { data } = await api.get<TowingDriversResponse>('/api/towing-drivers', {
      params
    });
    return data;
  },

  /**
   * GET /api/towing-drivers/:id
   * Busca um motorista específico por ID
   */
  getById: async (id: number): Promise<TowingDriver> => {
    const { data } = await api.get<TowingDriver>(`/api/towing-drivers/${id}`);
    return data;
  },
};
