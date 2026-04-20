import { BASE } from ".";
import type { AuthSession } from "../types";

/** Register a new user and return a full auth session (auto-login). */
export async function registerUser(
  username: string,
  email: string,
  password: string,
): Promise<AuthSession> {
  // 1. Register
  const regRes = await fetch(`${BASE}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username, email, password }),
  });
  if (!regRes.ok) {
    const body = await regRes.json();
    throw new Error(body.error ?? "Registration failed");
  }

  // 2. Auto-login
  return loginUser(email, password);
}

/** Sign in with email + password, returns a full auth session. */
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthSession> {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.error ?? "Login failed");
  }
  return res.json();
}

/**
 * Exchange a refresh token for a new access token.
 * Returns the updated session fields or null on failure.
 */
export async function refreshSession(
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const raw = localStorage.getItem("restroom_finder_session");
  if (!raw) return null;

  let refreshToken: string;
  try {
    refreshToken = JSON.parse(raw).refreshToken;
  } catch {
    return null;
  }

  const res = await fetch(`${BASE}/api/users/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;
  return res.json();
}

/** Revoke the refresh token on the server. */
export async function logoutApi(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await fetch(`${BASE}/api/users/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refreshToken }),
  });
}

