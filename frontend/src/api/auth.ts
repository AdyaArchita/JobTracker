import api from './axios';
import { AuthResponse, User } from '../types';

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', {
    name,
    email,
    password,
  });
  return data;
};

export const getMe = async (): Promise<{ user: User }> => {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data;
};
export const updateProfile = async (
  profileSummary: string
): Promise<{ user: User }> => {
  const { data } = await api.patch<{ user: User }>('/auth/me', {
    profileSummary,
  });
  return data;
};
