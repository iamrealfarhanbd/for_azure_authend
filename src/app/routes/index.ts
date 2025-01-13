import express, { Router } from "express";
import { userRoutes } from "../modules/User/user.route";
import { profileRoutes } from "../modules/Profile/profile.route";
import { ModuleType } from "../interfaces/route";
import { authRouter } from "../modules/Auth/auth.route";

const router = express.Router();

const moduleRoutes: ModuleType[] = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/profile",
    route: profileRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
