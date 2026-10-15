import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  __coldStartRetries?: number;
};

const SAFE_GET_TIMEOUT_MS = 75_000;
const MAX_SAFE_GET_RETRIES = 1;
const RETRYABLE_STATUSES = new Set([502, 503, 504]);

/**
 * Lets safe GET requests wait for a sleeping Render Free service to wake.
 * Only GET requests receive this longer timeout and at most one retry.
 * POST/PUT/PATCH/DELETE retain their existing timeout and are never replayed.
 */
export function installColdStartResilience(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    if ((config.method ?? 'get').toLowerCase() === 'get') {
      config.timeout = SAFE_GET_TIMEOUT_MS;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as RetryableRequestConfig | undefined;
      if (!config || (config.method ?? 'get').toLowerCase() !== 'get') {
        return Promise.reject(error);
      }
      if (error.code === 'ERR_CANCELED') return Promise.reject(error);

      const status = error.response?.status;
      const isTransient = !error.response || RETRYABLE_STATUSES.has(status ?? 0);
      const retries = config.__coldStartRetries ?? 0;
      if (!isTransient || retries >= MAX_SAFE_GET_RETRIES) {
        return Promise.reject(error);
      }

      config.__coldStartRetries = retries + 1;
      await new Promise<void>((resolve) => window.setTimeout(resolve, 1_500));
      return client.request(config);
    },
  );
}