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
}

export interface ServiceForm {
  payload?: ServiceFormPayload;
  flow_token: string;
  locksmith_all_doors_locked?: string;
  locksmith_key_is_inside_vehicle?: string;
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
  service_form: ServiceForm | null;
  origin_address: string | null;
  destination_address: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  associate_cars?: AssociateCars;
}

export interface Pagination {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface AssociateServicesResponse {
  data: AssociateService[];
  pagination: Pagination;
}

export const atendimentosService = {
  getAll: async (page: number = 1): Promise<AssociateServicesResponse> => {
    const { data } = await api.get<AssociateServicesResponse>('/api/associate-services', {
      params: { page }
    });
    return data;
  },
};
