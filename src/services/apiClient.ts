import { HomeLoanEnquiry } from '../types';

/**
 * Shared client for the PHP backend under /api.
 * Paths are intentionally relative so the SPA works both at the domain root
 * and inside a sub-directory (e.g. XAMPP http://localhost/BLR15/).
 */
export const API_BASE = 'api';

export async function apiFetch(route: string, init?: RequestInit): Promise<Response> {
  let response = await fetch(`${API_BASE}/${route}`, init);
  if (response.status === 404) {
    // Fallback for servers without URL rewriting: hit the front controller directly.
    const [path, query = ''] = route.split('?');
    const queryPart = query ? `&${query}` : '';
    response = await fetch(`${API_BASE}/index.php?route=${encodeURIComponent(path)}${queryPart}`, init);
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
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (init?.body) {
    headers['Content-Type'] = 'application/json';
  }
  const response = await apiFetch(route, { ...init, headers: { ...headers, ...(init?.headers as Record<string, string>) } });
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