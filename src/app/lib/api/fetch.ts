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
    const url = `${API_URL}${endpoint}`;
    console.log(`Making request to: ${url}`);

    const response = await fetch(url, defaultOptions);

    // Redireciona se o status for 401
    if (response.status === 401) {
      window.location.href = '/login';
      return {} as T;
    }

    // Verifica a resposta da API
    if (!response.ok) {
      const errorData = await response.text(); // Log detalhado do erro
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData}`);
    }

    const data = await response.json();
    console.log('Full Response:', data); // Log completo da resposta
    return data as T;
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
