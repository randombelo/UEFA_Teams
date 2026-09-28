import { mountApiStatus } from "../components/molecules/ApiStatus.js";

export function mountHome() {
  mountApiStatus(document.querySelector("#api-status"));
}