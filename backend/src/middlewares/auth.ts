import type { Context, Next } from "hono";
import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.slice(7);
  try {
    const payload = await verifyAccessToken(token);
    c.set("userId", payload.userId);
    c.set("username", payload.username);
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }

  await next();
};
