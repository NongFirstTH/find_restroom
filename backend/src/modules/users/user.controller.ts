import type { Context } from "hono";
import { UserService } from "./user.service.js";
import { RegisterSchema, LoginSchema, RefreshSchema } from "./user.schema.js";

const userService = new UserService();

export const getAllUsers = async (c: Context) => {
  try {
    const users = await userService.getAllUsers();
    return c.json(users);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const getUserById = async (c: Context) => {
  try {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }
    const user = await userService.getUserById(id);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const registerUser = async (c: Context) => {
  try {
    const body = await c.req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 422);
    }

    const { name, email, password } = parsed.data;

    const existingByEmail = await userService.checkUserExistsByEmail(email);
    if (existingByEmail) {
      return c.json({ error: "Email already registered" }, 409);
    }

    const existingByName = await userService.checkUserExistsByUsername(name);
    if (existingByName) {
      return c.json({ error: "Username already taken" }, 409);
    }

    const res = await userService.registerUser(name, email, password);
    return c.json(res, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const loginUser = async (c: Context) => {
  try {
    const body = await c.req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten().fieldErrors.email }, 422);
    }

    const { email, password } = parsed.data;
    const result = await userService.loginUser(email, password);
    if (!result) {
      return c.json({ error: "Invalid email or password" }, 401);
    }
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const refreshToken = async (c: Context) => {
  try {
    const body = await c.req.json();
    const parsed = RefreshSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 422);
    }

    const result = await userService.refreshAccessToken(parsed.data.refreshToken);
    if (!result) {
      return c.json({ error: "Invalid or expired refresh token" }, 401);
    }

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const logoutUser = async (c: Context) => {
  try {
    const userId = c.get("userId") as string;
    const body = await c.req.json();
    const parsed = RefreshSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 422);
    }

    await userService.logoutUser(userId, parsed.data.refreshToken);
    return c.json({ message: "Logged out" });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const getUserByEmail = async (c: Context) => {
  try {
    const emailParam = c.req.param("email");
    if (!emailParam) {
      return c.json({ error: "Email is required" }, 400);
    }

    const email = decodeURIComponent(emailParam);
    const user = await userService.checkUserExistsByEmail(email);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
