import { db } from "../../index.js";
import { usersTable, refreshTokensTable } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";
import { hashPassword, hashToken, verifyPassword } from "../../utils/hash.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";

export class UserService {
  async getAllUsers() {
    const users = await db
      .select({
        userId: usersTable.userId,
        username: usersTable.username,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable);
    return users;
  }

  async getUserById(id: string) {
    const user = await db
      .select({
        userId: usersTable.userId,
        username: usersTable.username,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.userId, id))
      .limit(1);

    return user[0] || null;
  }

  async registerUser(name: string, email: string, password: string) {
    const passwordHash = await hashPassword(password);

    await db.transaction(async (tx) => {
      await tx.insert(usersTable).values({
        username: name,
        email,
        passwordHash,
      });
    });

    return "success";
  }

  async loginUser(email: string, password: string) {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    const user = users[0];
    if (!user) return null;

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return null;

    const payload = { userId: user.userId, username: user.username };
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    // Store hashed refresh token — expires 7 days from now
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(refreshTokensTable).values({
      userId: user.userId,
      tokenHash: hashToken(refreshToken),
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
      },
    };
  }

  async refreshAccessToken(refreshToken: string) {
    let payload;
    try {
      payload = await verifyRefreshToken(refreshToken);
    } catch {
      return null;
    }

    const tokenHash = hashToken(refreshToken);
    const stored = await db
      .select()
      .from(refreshTokensTable)
      .where(
        and(
          eq(refreshTokensTable.userId, payload.userId),
          eq(refreshTokensTable.tokenHash, tokenHash)
        )
      )
      .limit(1);

    if (!stored[0] || stored[0].expiresAt < new Date()) {
      return null;
    }

    // Rotate: delete old refresh token and issue a new one
    await db
      .delete(refreshTokensTable)
      .where(eq(refreshTokensTable.tokenId, stored[0].tokenId));

    const tokenPayload = { userId: payload.userId, username: payload.username };
    const newAccessToken = await signAccessToken(tokenPayload);
    const newRefreshToken = await signRefreshToken(tokenPayload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(refreshTokensTable).values({
      userId: payload.userId,
      tokenHash: hashToken(newRefreshToken),
      expiresAt,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logoutUser(userId: string, refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    await db
      .delete(refreshTokensTable)
      .where(
        and(
          eq(refreshTokensTable.userId, userId),
          eq(refreshTokensTable.tokenHash, tokenHash)
        )
      );
  }

  async checkUserExistsByEmail(email: string) {
    const user = await db
      .select({
        userId: usersTable.userId,
        username: usersTable.username,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return user[0] || null;
  }

  async checkUserExistsByUsername(username: string) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    return user[0] || null;
  }
}
