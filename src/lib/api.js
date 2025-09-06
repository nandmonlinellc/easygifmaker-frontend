export function getApiBase() {
  // Prefer explicit Vite env var when present
  try {
    const envUrl = String(import.meta.env.VITE_API_URL || '').trim();
    if (envUrl) return envUrl;
  } catch {
    // ignore
  }

  // Local dev: default to Flask on 5001 when running from Vite host
  if (typeof window !== 'undefined' && window.location) {
    const { protocol, hostname, port } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5001';
    }
    // Same-origin fallback (when API is served by the same host)
    const portPart = port ? `:${port}` : '';
    return `${protocol}//${hostname}${portPart}`;
  }
  // Non-browser fallback
  return 'http://localhost:5001';
}
