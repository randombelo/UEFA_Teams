import { Footer } from "../components/organisms/Footer.js";
import { Header, mountHeader } from "../components/organisms/Header.js";

export function mountLayout() {
  const headerRoot = document.querySelector("#header-root");
  if (headerRoot) {
    headerRoot.innerHTML = Header({ active: document.body.dataset.page || "" });
    mountHeader(headerRoot.firstElementChild);   // pasa el <header class="app-header">
  }
  const footerRoot = document.querySelector("#footer-root");
  if (footerRoot) footerRoot.innerHTML = Footer();
}