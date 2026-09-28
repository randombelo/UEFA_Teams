import { api } from "../../api/axiosClient.js";
import { ENDPOINTS } from "../../config/endpointsConfig.js";

const HEALTH = ENDPOINTS.find((e) => e.key === "health");

export async function mountApiStatus(host) {
  if (!host || !HEALTH) return;
  host.textContent = "Comprobando API…";
  try {
    await api.get(HEALTH.url);
    host.innerHTML = `<span class="status-dot status-dot--online"></span> API: online`;
  } catch {
    host.innerHTML = `<span class="status-dot status-dot--offline"></span> API: offline`;
  }
}