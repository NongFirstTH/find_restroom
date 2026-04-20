const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Build headers with an optional Bearer token. */
const headers = (token?: string): Record<string, string> => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

/**
 * Fetch wrapper that transparently refreshes the access token on 401.
 * - `getToken`  — returns the current access token
 * - `onRefresh` — called with the new access token when a refresh succeeds
 * - `onLogout`  — called when refresh fails; should clear the session
 */
/** Singleton refresh promise — prevents concurrent refresh races. */
let _refreshPromise: Promise<{ accessToken: string; refreshToken: string } | null> | null = null;

async function fetchWithAuth(
  url: string,
  opts: RequestInit,
  getToken: () => string | null,
  onRefresh: (newAccessToken: string, newRefreshToken: string) => void,
  onLogout: () => void,
): Promise<Response> {
  const token = getToken();
  const res = await fetch(url, {
    ...opts,
    headers: { ...headers(token ?? undefined), ...(opts.headers ?? {}) },
  });

  if (res.status !== 401) return res;

  // Deduplicate concurrent 401s — only one refresh call in flight at a time
  const { refreshSession } = await import("./user");
  _refreshPromise ??= refreshSession().finally(() => { _refreshPromise = null; });
  const session = await _refreshPromise;

  if (!session) {
    onLogout();
    return res;
  }

  onRefresh(session.accessToken, session.refreshToken);

  // Retry original request with the new token
  return fetch(url, {
    ...opts,
    headers: { ...headers(session.accessToken), ...(opts.headers ?? {}) },
  });
}

export { BASE, headers, fetchWithAuth };
