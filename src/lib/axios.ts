import axios from "axios";

const isServer = typeof window === 'undefined';
const StrapiUrl = import.meta.env.STRAPI_URL;


const api = axios.create({
  baseURL: StrapiUrl,
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