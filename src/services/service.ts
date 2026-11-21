import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import { setupCache } from 'axios-cache-interceptor';
import { getToken } from 'firebase/app-check';

import { appCheck, auth } from '../firebaseApp';

const service = applyCaseMiddleware(axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  }),
  {
    ignoreHeaders: true,
  }
);
service.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  config.headers['Authorization'] = `Bearer ${token}`;

  try {
    const appCheckRes = await getToken(appCheck, false);
    config.headers['X-Firebase-AppCheck'] = appCheckRes.token;
  } catch (e) {
    console.error('Unable to get app check token');
  }
  return config;
});
setupCache(service);

export const CACHE_KEYS = {
  ME: 'get-me',
  LIST_VINYLS: 'list-vinyls',
  LIST_PLAYS: 'list-vinyl-plays',
  vinyl: (id: string) => `vinyl-${id}`,
  vinylPlays: (id: string) => `vinyl-plays-${id}`,
};

export default service;
