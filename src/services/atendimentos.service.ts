import api from '@/lib/api';

// ============================================
// INTERFACES - Estrutura Real da API
// ============================================
export interface Associates {
  id: string;
  ileva_associate_id: string | null;
  association: string;
  name: string;
  email: string | null;
  phone: string;
  cpf: string;
  created_at: string;
  updated_at: string;
}

export interface AssociateCars {
  id: string;
  associate_id: string | null;
  ileva_associate_vehicle_id: string | null;
  fipe_id: string | null;
  category: string;
  plate: string;
  chassi: string | null;
  brand: string | null;
  model: string | null;
  color: string | null;
  year: string | null;
  created_at: string;
  updated_at: string;
  associates?: Associates;
}

/** Chaves possíveis do questionário (service_form.payload) – API pode enviar outras. */
export interface ServiceFormPayload {
  vehicle_cargo?: string;
  associate_items?: string;
  vehicle_symptom?: string;
  vehicle_is_lowered?: string;
  any_wheel_is_locked?: string;
  number_of_passengers?: string;
  uber_will_be_necessary?: string;
  vehicle_is_easily_accessible?: string;
  documents_and_key_are_in_scene?: string;
  vehicle_is_moving?: string;
  is_to_activate_protection?: string;
  vehicle_is_at_collision_scene?: string;
  locksmith_all_doors_locked?: string;
  locksmith_key_is_inside_vehicle?: string;
  fuel_request?: string;
  fuel_price?: string;
  fuel_payment_type?: string;
  tire_change_quantity?: string;
  tire_change_associate_has_tools?: string;
  tire_change_associate_has_spare_tire?: string;
  battery_charge_resolution?: string;
  accessible_vehicle?: string;
  [key: string]: string | undefined;
}

/** service_form pode vir com ou sem payload; flow_token pode existir ou não. */
export interface ServiceForm {
  payload?: ServiceFormPayload | null;
  flow_token?: string;
  locksmith_all_doors_locked?: string;
  locksmith_key_is_inside_vehicle?: string;
}

/**
 * API pode retornar service_form de duas formas:
 * 1) Com payload: { payload: { vehicle_cargo: "...", ... }, flow_token?: "..." }
 * 2) Objeto plano: { vehicle_cargo: "...", associate_items: "...", ... }
 */
export type ServiceFormApi = ServiceForm | Record<string, string>;

export interface Call {
  id: string;
  towing_service_type: string | null;
  address: string | null;
  status: string | null;
  towing_status: string | null;
  association: string;
  created_at: string;
  updated_at: string;
  associate_service_id: string | null;
  [key: string]: unknown;
}

export interface AssociateService {
  id: string;
  associate_car_id: string | null;
  retell_call_id: string | null;
  ezchat_conversation_id: string | null;
  association: string;
  plataform: string;
  phone: string;
  request_reason: string | null;
  /** Forma 1: { payload: {...}, flow_token? }. Forma 2: objeto plano com chaves do questionário. */
  service_form?: ServiceFormApi | null;
  origin_address: string | null;
  destination_address: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  associate_cars?: AssociateCars;
  associate_service_events?: unknown[];
  calls?: Call[];
  accidents?: unknown[];
}

export interface Pagination {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface AssociateServicesResponse {
  data: AssociateService[];
  pagination: Pagination;
  status_counts: StatusCount[];
}

export interface AtendimentosFilters {
  page?: number;
  status?: string;
  request_reason?: string;
  plataform?: string;
  search?: string;
  order_by?: string;
  order?: string;
}

export const atendimentosService = {
  getAll: async (filters: AtendimentosFilters = {}): Promise<AssociateServicesResponse> => {
    const { page = 1, status, request_reason, plataform, search, order_by = 'updated_at', order = 'desc' } = filters;
    const params: Record<string, string | number> = { page };
    if (status && status !== 'todos') params.status = status;
    if (request_reason && request_reason !== 'todos') params.request_reason = request_reason;
    if (plataform && plataform !== 'todos') params.plataform = plataform;
    if (search?.trim()) params.search = search.trim();
    if (order_by) params.order_by = order_by;
    if (order) params.order = order;
    const { data } = await api.get<AssociateServicesResponse>('/api/associate-services', { params });
    return data;
  },

  getById: async (id: string): Promise<AssociateService> => {
    const { data } = await api.get<AssociateService>(`/api/associate-services/${id}`);
    return data;
  },

  // Busca detalhes do atendimento com polling até ter todos os dados
  getByIdWithPolling: async (id: string): Promise<AssociateService> => {
    const { data } = await api.get<AssociateService>(`/api/associate-services/${id}`);
    return data;
  },
};
