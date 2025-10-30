import axios from 'axios';
import {logApiEvent} from './apiLogger';
import {getCachedToken} from '../utils/storage';
import {store} from '../redux';
import {logoutUser, setLogoutUser} from '../redux/actions';

const axiosInstance = axios.create({
  // baseURL: 'https://caryaar.onrender.com/api/v1',
  baseURL: 'https://caryaar-dev-api.pedalsupclients.xyz/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Unified logger for all events
const logEvent = ({
  type,
  config = {},
  response = {},
  error = null,
  duration,
}) => {
  logApiEvent({
    type,
    method: config.method,
    url: config.url,
    headers: config.headers,
    data: config.data,
    params: config.params,
    status: response?.status,
    error: error?.message || null,
    duration,
  });
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  async config => {
    config.metadata = {startTime: Date.now()};

    try {
      if (!config?.skipAuth) {
        const token = await getCachedToken();
        // const token =
        //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1NjUyYzg3LWRlNjYtNDU2Zi1hNmZhLWNhYjc3ZmNjOGQxMCIsInJvbGVJZCI6Ijk4ZDk3ZGZmLTNhODYtNDVhNy1iYmE2LWY3ZDU4NzA2YzMwNiIsInJvbGUiOiJQQVJUTkVSIiwiaWF0IjoxNzQ3MDU4MzA3LCJleHAiOjE3NDk2NTAzMDd9.Zcj7eGgH4jallSUZPmK3RskjVxHnexnNKgbk6r3BUVU';
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
      }

      logEvent({type: 'request', config});
      return config;
    } catch (error) {
      logEvent({type: 'request_error', config, error});
      return Promise.reject(error);
    }
  },
  error => {
    logEvent({type: 'request_error', config: error?.config || {}, error});
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  response => {
    const startTime = response?.config?.metadata?.startTime || Date.now();
    const duration = Date.now() - startTime;

    logEvent({
      type: 'response',
      config: response.config,
      response,
      duration,
    });

    return response;
  },
  error => {
    const config = error?.response?.config || error?.config || {};
    const startTime = config?.metadata?.startTime || Date.now();
    const duration = Date.now() - startTime;

    logEvent({
      type: 'response_error',
      config,
      response: error.response,
      error,
      duration,
    });

    const status = error?.response?.status;
    const isTokenExpired = status === 401 || status === 402;
    if (isTokenExpired) {
      // Option 1: If using Redux
      store.dispatch(logoutUser());
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
