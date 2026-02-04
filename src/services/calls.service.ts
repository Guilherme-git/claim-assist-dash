import api from '@/lib/api';

// ============================================
// ENUMS
// ============================================

export enum CallStatus {
  searching_biker = "searching_biker",
  waiting_arrival = "waiting_arrival",
  in_primary_expertise_step = "in_primary_expertise_step",
  in_secondary_expertise_step = "in_secondary_expertise_step",
  in_service = "in_service",
  waiting_validation = "waiting_validation",
  in_validation = "in_validation",
  waiting_biker_see_validation = "waiting_biker_see_validation",
  approved = "approved",
  cancelled = "cancelled",
  cancelled_by_biker_not_found = "cancelled_by_biker_not_found",
}

export enum CallTowingStatus {
  waiting_driver_accept = "waiting_driver_accept",
  waiting_driver_access_app_after_call_accepted = "waiting_driver_access_app_after_call_accepted",
  waiting_arrival_to_checkin = "waiting_arrival_to_checkin",
  in_checking = "in_checking",
  waiting_arrival_to_checkout = "waiting_arrival_to_checkout",
  in_checkout = "in_checkout",
  waiting_in_shed = "waiting_in_shed",
  waiting_add_towing_delivery_call_trip = "waiting_add_towing_delivery_call_trip",
  finished = "finished",
  cancelled = "cancelled",
}

export enum TowingServiceType {
  // BÁSICOS
  towing = "towing",
  towing_breakdown = "towing_breakdown",
  battery = "battery",
  tire_change = "tire_change",
  locksmith = "locksmith",
  empty_tank = "empty_tank",
  other = "other",

  // BATERIA
  battery_charge_light = "battery_charge_light",
  battery_charge_moto = "battery_charge_moto",
  battery_charge_heavy = "battery_charge_heavy",
  battery_charge_utility = "battery_charge_utility",
  battery_replacement = "battery_replacement",

  // PNEU
  tire_change_light = "tire_change_light",
  tire_change_heavy = "tire_change_heavy",
  tire_change_utility = "tire_change_utility",

  // CHAVEIRO
  locksmith_automotive_imported = "locksmith_automotive_imported",
  locksmith_automotive_national = "locksmith_automotive_national",
  locksmith_residential = "locksmith_residential",

  // REBOQUE
  towing_extra_heavy = "towing_extra_heavy",
  towing_light = "towing_light",
  towing_locavibe = "towing_locavibe",
  towing_moto = "towing_moto",
  towing_heavy = "towing_heavy",
  towing_utility = "towing_utility",

  // OUTROS
  reserve_car = "reserve_car",
  fuel_assistance = "fuel_assistance",
}

export enum Association {
  solidy = "solidy",
  nova = "nova",
  motoclub = "motoclub",
  aprovel = "aprovel",
  agsmb = "agsmb",
}

export enum CallCreationMethod {
  webassist = "webassist",
  manually = "manually",
  associate_service = "associate_service",
}

// ============================================
// INTERFACES - Estrutura Real da API
// ============================================

// iLeva Associate Search
export interface ILevaVehicle {
  id: number;
  placa: string;
  chassi: string;
  ano_modelo: string;
  marca: string;
  modelo: string;
  cor: string;
}

export interface ILevaAssociate {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  tel_celular: string;
  association: string;
  vehicles: ILevaVehicle[];
}

export interface ILevaAssociateSearchResponse {
  query: {
    name: string;
    association: string;
  };
  total: number;
  data: ILevaAssociate[];
}

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
  associate_id: string;
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
}

export interface ServiceForm {
  payload?: ServiceFormPayload;
  flow_token: string;
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
}

export interface Call {
  id: string;
  towing_service_type: TowingServiceType | string;
  biker_id: string | null;
  associate_car_id: string;
  address: string;
  observation: string | null;
  status: CallStatus | string | null;
  towing_status: CallTowingStatus | string | null;
  creation_method: CallCreationMethod | string | null;
  towing_driver_accepted_at: string | null;
  association: Association | string;
  biker_accepted_at: string | null;
  created_at: string;
  updated_at: string;
  sort: string | null;
  user_id: string | null;
  estimated_time_arrival: string | null;
  biker_arrived_at: string | null;
  biker_finished_at: string | null;
  towing_driver_id: string | null;
  webassist_call_code: string | null;
  webassist_protocol_code: string | null;
  webassist_associate_document: string | null;
  webassist_assistance_code: string | null;
  uf_id: string;
  city_id: string;
  associate_service_id: string;
  associate_cars?: AssociateCars;
  bikers?: any | null;
  towing_drivers?: any | null;
  associate_services?: AssociateService;
  users?: any | null;
}

export interface Pagination {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface CallsResponse {
  data: Call[];
  pagination: Pagination;
}

// ============================================
// LABELS E CONFIGURAÇÕES
// ============================================

export const callStatusLabels: Record<string, string> = {
  searching_biker: "Procurando motoboy",
  waiting_arrival: "Aguardando chegada",
  in_primary_expertise_step: "Em vistoria Primária",
  in_secondary_expertise_step: "Em vistoria Secundária",
  in_service: "Em serviço",
  waiting_validation: "Aguardando validação",
  in_validation: "Em validação",
  waiting_biker_see_validation: "Aguardando motoboy ver validação",
  approved: "Aprovado",
  cancelled: "Cancelado",
  cancelled_by_biker_not_found: "Cancelado Por Não Encontrar Vistoriador Disponível",
};

export const callTowingStatusLabels: Record<string, string> = {
  waiting_driver_accept: "Aguardando aceite do motorista",
  waiting_driver_access_app_after_call_accepted: "Aguardando motorista acessar app após aceite",
  waiting_arrival_to_checkin: "Aguardando chegada para checkin",
  in_checking: "Em checkin",
  waiting_arrival_to_checkout: "Aguardando chegada para checkout",
  in_checkout: "Em checkout",
  waiting_in_shed: "Aguardando na garagem",
  waiting_add_towing_delivery_call_trip: "Aguardando adicionar viagem de destino",
  finished: "Finalizado",
  cancelled: "Cancelado",
};

export const towingServiceTypeLabels: Record<string, string> = {
  // BÁSICOS
  towing: "Reboque",
  towing_breakdown: "Reboque com Falha",
  battery: "Bateria",
  tire_change: "Troca de Pneu",
  locksmith: "Chaveiro",
  empty_tank: "Tanque Vazio",
  other: "Outro",

  // BATERIA
  battery_charge_light: "Carga de Bateria - Leve",
  battery_charge_moto: "Carga de Bateria - Moto",
  battery_charge_heavy: "Carga de Bateria - Pesado",
  battery_charge_utility: "Carga de Bateria - Utilitário",
  battery_replacement: "Troca de Bateria",

  // PNEU
  tire_change_light: "Troca de Pneu - Leve",
  tire_change_heavy: "Troca de Pneu - Pesado",
  tire_change_utility: "Troca de Pneu - Utilitário",

  // CHAVEIRO
  locksmith_automotive_imported: "Chaveiro Automotivo - Importado",
  locksmith_automotive_national: "Chaveiro Automotivo - Nacional",
  locksmith_residential: "Chaveiro Residencial",

  // REBOQUE
  towing_extra_heavy: "Reboque Extra Pesado",
  towing_light: "Reboque Leve",
  towing_locavibe: "Reboque Locavibe",
  towing_moto: "Reboque Moto",
  towing_heavy: "Reboque Pesado",
  towing_utility: "Reboque Utilitário",

  // OUTROS
  reserve_car: "Carro Reserva",
  fuel_assistance: "Auxílio Combustível",
};

export const associationLabels: Record<string, string> = {
  solidy: "Solidy",
  nova: "Nova",
  motoclub: "Motoclub",
  aprovel: "AAPROVEL",
  agsmb: "Agsmb",
};

// Variantes de Badge baseadas nos status
export type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

export const callStatusVariants: Record<string, BadgeVariant> = {
  searching_biker: "secondary",
  waiting_arrival: "outline",
  in_primary_expertise_step: "default",
  in_secondary_expertise_step: "default",
  in_service: "default",
  waiting_validation: "destructive",
  in_validation: "default",
  waiting_biker_see_validation: "default",
  approved: "outline",
  cancelled: "destructive",
  cancelled_by_biker_not_found: "destructive",
};

export const callTowingStatusVariants: Record<string, BadgeVariant> = {
  waiting_driver_accept: "secondary",
  waiting_driver_access_app_after_call_accepted: "outline",
  waiting_arrival_to_checkin: "outline",
  in_checking: "default",
  waiting_arrival_to_checkout: "outline",
  in_checkout: "default",
  waiting_in_shed: "default",
  waiting_add_towing_delivery_call_trip: "destructive",
  finished: "outline",
  cancelled: "destructive",
};

// ============================================
// SERVICE
// ============================================

export interface CallsFilters {
  page?: number;
  limit?: number;
  status?: string;
  towing_service_type?: string;
  association?: string;
  search?: string;
}

export interface CreateTowingCallPayload {
  associate_car_id: number;
  address: string;
  association: string;
  towing_service_type: string;
  observation?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  uf_id: number;
  city_id: number;
  destination?: {
    address?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

export const callsService = {
  /**
   * GET /api/calls/guinchos
   * Filtros disponíveis: page, limit, status (calls_status), towing_service_type, association, search
   * NOTA: status filtra pelo campo 'status' (calls_status), não pelo 'towing_status'
   */
  getAll: async (filters: CallsFilters = {}): Promise<CallsResponse> => {
    const { page = 1, limit = 10, status, towing_service_type, association, search } = filters;
    const params: Record<string, string | number> = { page, limit };
    if (status && status !== 'todos') params.status = status;
    if (towing_service_type && towing_service_type !== 'todos') params.towing_service_type = towing_service_type;
    if (association && association !== 'todos') params.association = association;
    if (search && search.trim()) params.search = search.trim();
    const { data } = await api.get<CallsResponse>('/api/calls/guinchos', { params });
    return data;
  },

  /**
   * GET /api/associates/search
   * Busca associados conforme o usuário digita
   */
  searchAssociates: async (name: string, association: string): Promise<ILevaAssociateSearchResponse> => {
    const { data } = await api.get<ILevaAssociateSearchResponse>('/api/associates/search', {
      params: { name, association },
    });
    return data;
  },

  /**
   * POST /api/calls/guinchos
   * Cria um novo chamado de guincho
   */
  createTowingCall: async (payload: CreateTowingCallPayload): Promise<Call> => {
    const { data } = await api.post<Call>('/api/calls/guinchos', payload);
    return data;
  },
};
