import { api } from "../api/axiosClient.js";
import { ENDPOINTS } from "../config/endpointsConfig.js";

const EP = Object.fromEntries(ENDPOINTS.map((e) => [e.key, e]));
const resolveUrl = (ep, id) => (id ? ep.url.replace("{id}", id) : ep.url);

export const competitionService = {
  list:  ({ skip = 0, limit = 100 } = {}) => api.get(EP.listCompetitions.url, { params: { skip, limit } }),
  get:   (id) => api.get(resolveUrl(EP.getCompetition, id)),
  create:(data) => api.post(EP.createCompetition.url, data),
  update:(id, data) => api.put(resolveUrl(EP.updateCompetition, id), data),
  remove:(id) => api.delete(resolveUrl(EP.deleteCompetition, id)),
};