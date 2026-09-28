import { Badge } from "../atoms/Badge.js";
import { Btn } from "../atoms/Btn.js";

const METHOD_VARIANT = { GET: "success", POST: "accent", PUT: "neutral", DELETE: "danger" };
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function EndpointCard({ ep }) {
  const executable = ep.method === "GET" && !ep.url.includes("{id}");
  const body = ep.example ? escapeHtml(JSON.stringify(ep.example, null, 2)) : "";
  return `
    <article class="endpoint-card">
      <header class="endpoint-card__head">
        ${Badge({ label: ep.method, variant: METHOD_VARIANT[ep.method] || "neutral" })}
        <h3 class="endpoint-card__name">${ep.name}</h3>
        ${executable ? Btn({ label: "Probar", variant: "ghost", size: "sm", id: `probe-${ep.key}`, "data-probe": ep.url }) : ""}
      </header>
      <code class="endpoint-card__url">${ep.method} ${ep.url}</code>
      <p class="endpoint-card__summary">${ep.summary}</p>
      <p class="endpoint-card__meta"><strong>Parámetros:</strong> ${ep.params}</p>
      ${body ? `<pre class="endpoint-card__pre">${body}</pre>` : ""}
      <pre class="endpoint-card__response" hidden></pre>
    </article>`;
}