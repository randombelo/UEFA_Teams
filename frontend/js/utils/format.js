export function formatCurrency(value) {
  if (value == null || value === "") return "—";
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");   // truco didáctico: evita que JS interprete la fecha en UTC y la desfase por zona horaria
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(d);
}