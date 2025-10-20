export function getBaseUrl() {
  // En el navegador: usar relativo
  if (typeof window !== "undefined") return "";
  // En Vercel (producción)
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // (opcional) si configurás tu propio dominio
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  // Desarrollo local
  return "http://localhost:3000";
}
