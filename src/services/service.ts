import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import { setupCache } from 'axios-cache-interceptor';

import { getAuth } from '@firebase/auth';

const service = applyCaseMiddleware(axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
}));
service.interceptors.request.use(async (config) => {
  const token = await getAuth().currentUser?.getIdToken();
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});
setupCache(service);

export const CACHE_KEYS = {
  ME: 'get-me',
  LIST_VINYLS: 'list-vinyls',
  LIST_PLAYS: 'list-vinyl-plays',
  vinyl: (id: string) => `vinyl-${id}`,
};

export default service;

export const verifyRecaptcha = async (token: string, action: string) => {
  return await service.post(`/verify-recaptcha/`, { token, action });
}
