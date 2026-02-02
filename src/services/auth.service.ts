import api from '@/lib/api';

// ============================================
// INTERFACES - Estrutura da API de Login
// ============================================
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginUser {
  name: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user?: LoginUser;
  token: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/api/login', payload);
    return data;
  },
};
