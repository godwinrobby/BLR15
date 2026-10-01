import { AdminUser } from '../types';
import { apiJson, setToken, clearToken, getToken, AUTH_EXPIRED_EVENT } from './apiClient';

/**
 * JWT authentication for the Admin portal.
 *
 * The access token is persisted in localStorage (see apiClient) and attached to
 * every API request automatically; the signed-in user is cached alongside it so
 * the UI can render immediately on reload.
 */
const USER_KEY = 'blr15_admin_user';

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AdminUser;
}

interface AuthEnvelope<T> {
  success: boolean;
  data: T;
}

export const login = async (email: string, password: string): Promise<AdminUser> => {
  const body = await apiJson<AuthEnvelope<LoginResponse>>('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setToken(body.data.access_token);
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(body.data.user));
  } catch {
    /* ignore */
  }

  return body.data.user;
};

export const logout = async (): Promise<void> => {
  try {
    await apiJson('auth/logout', { method: 'POST' });
  } catch {
    /* token may already be expired/invalid — clear locally regardless */
  }
  clearToken();
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
};

export const fetchMe = async (): Promise<AdminUser> => {
  const body = await apiJson<AuthEnvelope<AdminUser>>('auth/me');
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(body.data));
  } catch {
    /* ignore */
  }
  return body.data;
};

export const getCurrentUser = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => Boolean(getToken());

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmation: string
): Promise<void> => {
  await apiJson('auth/change-password', {
    method: 'POST',
    body: JSON.stringify({
      currentPassword,
      newPassword,
      newPassword_confirmation: confirmation,
    }),
  });
};

export { AUTH_EXPIRED_EVENT };
