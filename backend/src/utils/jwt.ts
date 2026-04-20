import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import 'dotenv/config';

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) throw new Error("JWT_SECRET environment variable is required");
const JWT_SECRET = new TextEncoder().encode(rawSecret);

const rawRefreshSecret = process.env.JWT_REFRESH_SECRET;
if (!rawRefreshSecret) throw new Error("JWT_REFRESH_SECRET environment variable is required");
const JWT_REFRESH_SECRET = new TextEncoder().encode(rawRefreshSecret);

export interface TokenPayload extends JWTPayload {
  userId: string;
  username: string;
}

export const signAccessToken = async (payload: Omit<TokenPayload, "iat" | "exp">): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(JWT_SECRET);
};

export const signRefreshToken = async (payload: Omit<TokenPayload, "iat" | "exp">): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_REFRESH_SECRET);
};

export const verifyAccessToken = async (token: string): Promise<TokenPayload> => {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as TokenPayload;
};

export const verifyRefreshToken = async (token: string): Promise<TokenPayload> => {
  const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
  return payload as TokenPayload;
};
