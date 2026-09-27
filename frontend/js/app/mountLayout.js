import { Footer } from "../components/organisms/Footer.js";
import { Header, mountHeader } from "../components/organisms/Header.js";
import { mountToast } from "../components/organisms/Toast.js";

export function mountLayout() {
  const headerRoot = document.querySelector("#header-root");
  if (headerRoot) {
    headerRoot.innerHTML = Header({ active: document.body.dataset.page || "" });
    mountHeader(headerRoot.firstElementChild);
  }
  const footerRoot = document.querySelector("#footer-root");
  if (footerRoot) footerRoot.innerHTML = Footer();
  mountToast();
}