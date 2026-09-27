import { api } from "../api/axiosClient.js";
import { ENDPOINTS } from "../config/endpointsConfig.js";

const EP = Object.fromEntries(ENDPOINTS.map((e) => [e.key, e]));
const resolveUrl = (ep, id) => (id ? ep.url.replace("{id}", id) : ep.url);

export const playerService = {
  list: ({ clubId = null, skip = 0, limit = 100 } = {}) =>
    api.get(EP.listPlayers.url, {
      params: { skip, limit, ...(clubId ? { club_id: clubId } : {}) },
    }),
  get:   (id) => api.get(resolveUrl(EP.getPlayer, id)),
  create:(data) => api.post(EP.createPlayer.url, data),
  update:(id, data) => api.put(resolveUrl(EP.updatePlayer, id), data),
  remove:(id) => api.delete(resolveUrl(EP.deletePlayer, id)),
};