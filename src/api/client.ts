// ============================================================
// VMS API Client - Ported from Flutter api_client.dart
// ============================================================

import axios from 'axios';
import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { BASE_URL } from './constants';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error('❌ Response Error:', {
        status: error.response?.status,
        message: error.message,
      });
    }
    return Promise.reject(error);
  }
);

// ============================================================
// API Methods
// ============================================================

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number | null;
}

/**
 * POST request
 */
export async function post<T = unknown>(
  endpoint: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.post<T>(endpoint, data, config);
    return {
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const errorMessage = 
      axiosError.response?.data?.error || 
      axiosError.response?.data?.message || 
      axiosError.message || 
      'Something went wrong';
    
    return {
      data: null,
      error: errorMessage,
      status: axiosError.response?.status || null,
    };
  }
}

/**
 * GET request
 */
export async function get<T = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.get<T>(endpoint, config);
    return {
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const errorMessage = 
      axiosError.response?.data?.error || 
      axiosError.response?.data?.message || 
      axiosError.message || 
      'Something went wrong';
    
    return {
      data: null,
      error: errorMessage,
      status: axiosError.response?.status || null,
    };
  }
}

/**
 * PUT request
 */
export async function put<T = unknown>(
  endpoint: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.put<T>(endpoint, data, config);
    return {
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const errorMessage = 
      axiosError.response?.data?.error || 
      axiosError.response?.data?.message || 
      axiosError.message || 
      'Something went wrong';
    
    return {
      data: null,
      error: errorMessage,
      status: axiosError.response?.status || null,
    };
  }
}

/**
 * DELETE request
 */
export async function del<T = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.delete<T>(endpoint, config);
    return {
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const errorMessage = 
      axiosError.response?.data?.error || 
      axiosError.response?.data?.message || 
      axiosError.message || 
      'Something went wrong';
    
    return {
      data: null,
      error: errorMessage,
      status: axiosError.response?.status || null,
    };
  }
}

/**
 * POST request with FormData (for file uploads)
 */
export async function postFormData<T = unknown>(
  endpoint: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.post<T>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const errorMessage = 
      axiosError.response?.data?.error || 
      axiosError.response?.data?.message || 
      axiosError.message || 
      'Something went wrong';
    
    return {
      data: null,
      error: errorMessage,
      status: axiosError.response?.status || null,
    };
  }
}

export default apiClient;
