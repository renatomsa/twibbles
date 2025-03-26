import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8888',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

interface ApiResponse<T> {
    data: T;
    message?: string;
    status_code: number;
}

export const apiService = {
    // GET request
    get: async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
        const response = await api.get(url, { params });
        return response.data;
    },

    // POST request
    post: async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
        const response = await api.post(url, data);
        return response.data;
    },

    // PUT request
    put: async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
        const response = await api.put(url, data);
        return response.data;
    },

    // DELETE request
    delete: async <T>(url: string): Promise<ApiResponse<T>> => {
        const response = await api.delete(url);
        return response.data;
    },

    // PATCH request
    patch: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
        const response = await api.patch(url, data);
        return response.data;
    }
};

export default api;