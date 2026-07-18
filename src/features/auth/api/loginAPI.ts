import { apiFetch } from '../../../api/client';

export const loginAPI = async (data: Record<string, string>) => {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};