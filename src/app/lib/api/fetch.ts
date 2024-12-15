// src/app/lib/api/fetch.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Exporta as interfaces para que possam ser utilizadas em outros arquivos
export interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface UserData {
  first_name: string;
  last_name: string;
  email: string;
}

async function customFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);

    if (response.status === 401) {
      window.location.href = '/auth/login';
      return {} as T;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string): Promise<T> => 
    customFetch<T>(endpoint),
  
  post: <T, D>(endpoint: string, data: D): Promise<T> => 
    customFetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T, D>(endpoint: string, data: D): Promise<T> => 
    customFetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string): Promise<T> => 
    customFetch<T>(endpoint, {
      method: 'DELETE',
    }),
};

// Exporta o tipo para uso em outros arquivos
export type Api = typeof api;