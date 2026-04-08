import axios from "axios";
import api, { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/utils/axios";

export function storeTokens(access: string, refresh: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function extractApiErrorMessage(err: unknown): string {
  if (!axios.isAxiosError(err) || !err.response?.data) {
    return "Something went wrong. Please try again.";
  }
  const data = err.response.data as Record<string, unknown>;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail) && data.detail.length) {
    return String(data.detail[0]);
  }
  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value.length) return String(value[0]);
    if (typeof value === "string") return value;
  }
  return "Something went wrong. Please try again.";
}

export type RegisterPayload = {
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
};

export type AuthUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

export type RegisterResponse = {
  user: AuthUser;
  access: string;
  refresh: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
};

export async function registerAccount(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>(`auth/register/`, payload);
  return data;
}

export async function loginAccount(
  email: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(`auth/login/`, {
    email,
    password,
  });
  return data;
}
