import api from '@/lib/api';

// ============================================
// INTERFACES
// ============================================

export interface UF {
  id: number;
  code: string;
  name: string;
}

export interface TowingSetting {
  id: number;
  uf: UF;
  excess_km_price: number;
  departure_price: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface TowingSettingsResponse {
  total: number;
  data: TowingSetting[];
}

export interface CreateTowingSettingPayload {
  uf_id: number;
  excess_km_price: number;
  departure_price: number;
}

export interface UpdateTowingSettingPayload {
  excess_km_price: number;
  departure_price: number;
}

// ============================================
// SERVICE
// ============================================

export const towingSettingsService = {
  /**
   * GET /api/towing-settings
   * Lista todas as configurações de guincho
   */
  getAll: async (): Promise<TowingSettingsResponse> => {
    const { data } = await api.get<TowingSettingsResponse>('/api/towing-settings');
    return data;
  },

  /**
   * GET /api/towing-settings/:id
   * Busca uma configuração específica por ID
   */
  getById: async (id: number): Promise<TowingSetting> => {
    const { data } = await api.get<TowingSetting>(`/api/towing-settings/${id}`);
    return data;
  },

  /**
   * POST /api/towing-settings
   * Cria uma nova configuração de guincho
   */
  create: async (payload: CreateTowingSettingPayload): Promise<{ message: string; data: TowingSetting }> => {
    const { data } = await api.post<{ message: string; data: TowingSetting }>(
      '/api/towing-settings',
      payload
    );
    return data;
  },

  /**
   * PUT /api/towing-settings/:id
   * Atualiza uma configuração existente
   */
  update: async (
    id: number,
    payload: UpdateTowingSettingPayload
  ): Promise<UpdateTowingSettingPayload> => {
    const { data } = await api.put<UpdateTowingSettingPayload>(
      `/api/towing-settings/${id}`,
      payload
    );
    return data;
  },

  /**
   * DELETE /api/towing-settings/:id
   * Remove uma configuração
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/towing-settings/${id}`);
  },
};
