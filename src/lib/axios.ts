import axios from "axios";

const StrapiUrl = import.meta.env.STRAPI_URL || 'https://idea-drop-backend-1.onrender.com'


const api = axios.create({
  baseURL: StrapiUrl,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' }
})


export default api