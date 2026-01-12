import axios, { type AxiosInstance, AxiosError } from 'axios';
import { userAuthStore } from '@/stores';
import { ApiErrorCode } from './errors';


const ibpvApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_IBPV_API_URL,
});

ibpvApi.interceptors.request.use((config) => {
  const auth = userAuthStore();
  const credentials = auth.$state.credentials;

  if (!credentials) {
    return config;
  }

  const isExpired = Date.now() >= credentials.exp * 1000;

  if (isExpired) {
    auth.logout();

    const error = new AxiosError(
      'Token expired',
      ApiErrorCode.TOKEN_EXPIRED
    );

    return Promise.reject(error);
  }
  config.headers.Authorization = `Bearer ${credentials.jwt}`;
  return config;
});

export default ibpvApi;
