import { Hono } from "hono";
import {
  getAllUsers,
  getUserByEmail,
  getUserById,
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} from "../modules/users/user.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

// create users route
const usersRoute = new Hono();

// get all users
usersRoute.get("/", authMiddleware, getAllUsers);

// get user by id
usersRoute.get("/:id", authMiddleware, getUserById);

// get user by email (protected — returns public info only)
usersRoute.get("/by-email/:email", authMiddleware, getUserByEmail);

// register
usersRoute.post("/register", registerUser);

// login
usersRoute.post("/login", loginUser);

// refresh access token
usersRoute.post("/refresh", refreshToken);

// logout (revoke refresh token)
usersRoute.post("/logout", authMiddleware, logoutUser);

export default usersRoute;
