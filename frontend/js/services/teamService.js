import { api } from "../api/axiosClient.js";
import { ENDPOINTS } from "../config/endpointsConfig.js";

const EP = Object.fromEntries(ENDPOINTS.map((e) => [e.key, e]));
const resolveUrl = (ep, id) => (id ? ep.url.replace("{id}", id) : ep.url);  // plantilla {id} → valor real

export const teamService = {
  list:  ({ skip = 0, limit = 100 } = {}) => api.get(EP.listTeams.url, { params: { skip, limit } }),
  get:   (id) => api.get(resolveUrl(EP.getTeam, id)),
  create:(data) => api.post(EP.createTeam.url, data),
  update:(id, data) => api.put(resolveUrl(EP.updateTeam, id), data),
  remove:(id) => api.delete(resolveUrl(EP.deleteTeam, id)),   // 204 → resuelve con true (interceptor)
};