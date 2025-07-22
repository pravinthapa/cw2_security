import api from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'OWNER' | 'VIEWER' | 'EMERGENCY_CONTACT' | 'ADMIN';
  mfaEnabled: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface MfaVerification {
  email: string;
  code: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  requiresMfa?: boolean;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.token && !response.data.requiresMfa) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  async register(data: RegisterData): Promise<{ user: User }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  async verifyMfa(data: MfaVerification): Promise<LoginResponse> {
    const response = await api.post('/auth/verify-mfa', data);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<{ token: string; user: User }> {
    const response = await api.post('/auth/refresh');
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();