import axios from "axios";

const isServer = typeof window === 'undefined';
const isDevelopment = import.meta.env.DEV;

const getBaseURL = () => {
  // Server-side
  if (isServer) {
    // If API_URL is set, use it; otherwise, only use localhost in development
    if (process.env.API_URL) {
      return process.env.API_URL;
    }
    // In production server, don't make API calls (or use relative path)
    return isDevelopment ? 'http://localhost:8000' : '';
  }
  
  // Client-side
  if (isDevelopment) {
    return 'http://localhost:8000'; // json-server
  }
  
  // Production client: use relative path (your Nitro API)
  return '/api';
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' }
})

// Only use interceptor on server
if (isServer) {
  api.interceptors.request.use(config => {
    if (config.url && config.url.startsWith('/api')) {
      config.url = config.url.replace(/^\/api/, '') || '/'
    }
    return config
  })
}

export default api