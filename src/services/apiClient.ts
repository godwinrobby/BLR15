import { HomeLoanEnquiry } from '../types';

/**
 * Shared client for the BLR15 Laravel API (/api/v1).
 *
 * The base is intentionally relative by default so the SPA keeps working when
 * served next to the API (XAMPP sub-directory). Point VITE_API_BASE_URL at an
 * absolute URL (e.g. http://127.0.0.1:8199/api) to target a remote API.
 */
export const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'api';
export const API_V1 = `${API_BASE}/v1`;

const TOKEN_KEY = 'blr15_jwt_token';

/** Fired whenever a request is rejected with 401 (expired/invalid token). */
export const AUTH_EXPIRED_EVENT = 'blr15-auth-expired';

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore quota / privacy-mode errors */
  }
};

export const clearToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

/**
 * Performs a fetch against the API, attaching the JWT (when present) and
 * clearing it + notifying listeners on a 401.
 */
export async function apiFetch(route: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers || {});
  headers.set('Accept', 'application/json');
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_V1}/${route}`, { ...init, headers });

  if (response.status === 401) {
    clearToken();
    window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
  }

  return response;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Performs a request and returns the parsed JSON body.
 * Throws {@link ApiError} (with the server's message) on non-2xx responses.
 */
export async function apiJson<T = unknown>(route: string, init?: RequestInit): Promise<T> {
  const response = await apiFetch(route, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError((data as { error?: string }).error || `HTTP ${response.status}`, response.status);
  }
  return data as T;
}

/** Standard list/item response envelopes used by /api/enquiries and /api/staff. */
export interface ApiListResponse<T> {
  success: boolean;
  count?: number;
  data: T[];
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}

export type { HomeLoanEnquiry };