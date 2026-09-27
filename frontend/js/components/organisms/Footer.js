export function Footer({ text = "© 2026 UEFA Teams API - Proyecto de Formacion FullStack" } = {}) {
  return `
    <footer class="app-footer">
      <p>${text}</p>
    </footer>
  `;
}