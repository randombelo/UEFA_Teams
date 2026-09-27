import { normalizeApiError } from "./normalizeApiError.js";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => (res.status === 204 ? true : res.data),
  (error) => Promise.reject(normalizeApiError(error))
);