import axios from 'axios';

if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
  console.warn(
    '[axios] VITE_API_URL is not set. Copy .env.example to .env.local and set it, or requests will fail.'
  );
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: لإضافة التوكن قبل إرسال الطلب
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: للتعامل مع ردود السيرفر (مثل 401 أو 403)
api.interceptors.response.use(
  (response) => response, // إذا نجح الطلب مرره كما هو
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Auth error or Forbidden, redirecting to login...");
     // localStorage.removeItem('token');
     // localStorage.removeItem('user');
     // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;