import axios from 'axios';

// Base URL for API
// In development, it falls back to localhost
// In production, set VITE_API_BASE_URL in your environment (e.g. https://api.burlart.az/api/auth)
const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000/api/auth';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (email: string, password: string, language = 'en', theme = 'dark') => {
    const response = await api.post('/register/', { email, password, language, theme });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/login/', { email, password });
    return response.data;
  },

  loginWithGoogle: async (idToken: string) => {
    const response = await api.post('/google-login/', { id_token: idToken });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/profile/');
    return response.data;
  },
  
  updateProfile: async (data: any) => {
    const response = await api.patch('/profile/update/', data);
    return response.data;
  },
};

// Video API
export const videoAPI = {
  generateVideo: async (prompt: string, tool: string, options?: any) => {
    const response = await api.post('/videos/generate/', { prompt, tool, options });
    return response.data;
  },
  
  getVideos: async () => {
    const response = await api.get('/videos/');
    return response.data;
  },
  
  getVideo: async (id: number) => {
    const response = await api.get(`/videos/${id}/`);
    return response.data;
  },
};

// Image API
export const imageAPI = {
  generateImage: async (prompt: string, tool: string, options?: any) => {
    const response = await api.post('/images/generate/', { prompt, tool, options });
    return response.data;
  },
  
  getImages: async () => {
    const response = await api.get('/images/');
    return response.data;
  },
  
  getImage: async (id: number) => {
    const response = await api.get(`/images/${id}/`);
    return response.data;
  },
};

// Tools API
export const toolsAPI = {
  getTools: async () => {
    const response = await api.get('/tools/');
    return response.data;
  },
};

// Subscription API
export const subscriptionAPI = {
  getPlans: async () => {
    const response = await api.get('/subscriptions/plans/');
    return response.data;
  },
  
  createSubscription: async (planId: string, autoRenew: boolean = true) => {
    const response = await api.post('/subscriptions/create/', { plan: planId, auto_renew: autoRenew });
    return response.data;
  },
  
  getInfo: async () => {
    const response = await api.get('/subscriptions/info/');
    return response.data;
  },
  
  cancelSubscription: async () => {
    const response = await api.post('/subscriptions/cancel/');
    return response.data;
  },
};

// Top-up API
export const topupAPI = {
  getPackages: async () => {
    const response = await api.get('/topup/packages/');
    return response.data;
  },
  
  createTopup: async (packageId: string, paymentId?: string) => {
    const response = await api.post('/topup/create/', { package: packageId, payment_id: paymentId });
    return response.data;
  },
  
  completeTopup: async (purchaseId: number, paymentId?: string) => {
    const response = await api.post('/topup/complete/', { purchase_id: purchaseId, payment_id: paymentId });
    return response.data;
  },
  
  getHistory: async () => {
    const response = await api.get('/topup/history/');
    return response.data;
  },
};

export default api;

