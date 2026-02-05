import api from '@/lib/api';

// ============================================
// INTERFACES - Dashboard Data
// ============================================

export interface QuickStats {
  averageResponseTime: string;
  resolutionRate: string;
}

export interface TowingTicket {
  averageTicket: string;
  totalRevenue: string;
  paidBillsCount: number;
}

export interface AssociateCar {
  id: string;
  associate_id: string;
  ileva_associate_vehicle_id: string | null;
  fipe_id: string | null;
  category: string;
  plate: string;
  chassi: string;
  brand: string;
  model: string;
  color: string;
  year: string;
  created_at: string;
  updated_at: string;
  associates?: Associate;
}

export interface Associate {
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

export interface RecentAttendance {
  id: string;
  associate_car_id: string | null;
  retell_call_id: string | null;
  ezchat_conversation_id: string | null;
  association: string;
  plataform: string;
  phone: string;
  request_reason: string | null;
  service_form: any;
  origin_address: string | null;
  destination_address: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  associate_cars?: AssociateCar | null;
}

export interface AttendanceByHour {
  hour: string;
  attendances: number;
}

export interface DashboardData {
  attendancesToday: number;
  attendancesInProgress: number;
  attendancesFinished: number;
  attendancesDelayed: number;
  averageServiceTime: string;
  averageTowingExecutionTime: string;
  quickStats: QuickStats;
  towingTicket: TowingTicket;
  recentAttendances: RecentAttendance[];
}

// ============================================
// LABELS & VARIANTS
// ============================================

export const statusLabels: Record<string, string> = {
  waiting_identification: "Aguardando identificação",
  waiting_origin_location: "Aguardando localização",
  answering_service_form: "Respondendo formulário",
  finished: "Finalizado",
  in_progress: "Em andamento",
  cancelled: "Cancelado",
};

export const statusVariants: Record<string, "default" | "secondary" | "success" | "destructive" | "warning"> = {
  waiting_identification: "secondary",
  waiting_origin_location: "secondary",
  answering_service_form: "warning",
  in_progress: "default",
  finished: "success",
  cancelled: "destructive",
};

export const requestReasonLabels: Record<string, string> = {
  flat_tire: "Pneu furado",
  breakdown_by_mechanical_failure_or_electric: "Pane mecânica ou elétrica",
  battery_discharge: "Bateria descarregada",
  out_of_fuel: "Sem combustível",
  locksmith: "Chaveiro",
  other: "Outro",
};

export const platformLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  phone: "Telefone",
  web: "Web",
  app: "Aplicativo",
};

// ============================================
// SERVICE
// ============================================

export interface DashboardFilters {
  start_date?: string; // Formato: YYYY-MM-DD
  end_date?: string;   // Formato: YYYY-MM-DD
}

export const dashboardService = {
  /**
   * GET /api/dashboard
   * Busca dados completos do dashboard
   * @param filters - Filtros opcionais (start_date, end_date)
   */
  getData: async (filters?: DashboardFilters): Promise<DashboardData> => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const url = `/api/dashboard${queryString ? `?${queryString}` : ''}`;

    const { data } = await api.get<DashboardData>(url);
    return data;
  },
};
