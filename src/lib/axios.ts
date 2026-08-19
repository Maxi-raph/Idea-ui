import axios from "axios";

const getServerURL = () =>
  process.env.API_URL || 'http://localhost:8000';

const getBaseURL = () => {
  if (typeof window === 'undefined') {
    return getServerURL()
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:8000'
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' }
})

// On server remove the /api prefix because the proxy isn't involved on SSR
if (typeof window === 'undefined') {
  api.interceptors.request.use(config => {
    if (config.url && config.url.startsWith('/api')) {
      config.url = config.url.replace(/^\/api/, '') || '/'
    }
    return config
  })
}

export default api
