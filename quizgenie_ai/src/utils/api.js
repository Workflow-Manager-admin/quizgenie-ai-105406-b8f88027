const API_BASE =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";

/**
 * PUBLIC_INTERFACE
 * Fetch current user profile (from token).
 */
export async function getProfile(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return undefined;
  const data = await res.json();
  return data.user;
}

/**
 * PUBLIC_INTERFACE
 * Simple API fetch helper
 */
export async function apiRequest(path, options = {}) {
  let headers = Object.assign(
    { "Content-Type": "application/json" },
    options.headers || {}
  );
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  // Could throw if !res.ok depending on need
  if (!res.ok) throw new Error((await res.json()).error || "API Error");
  return await res.json();
}
