"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const profile_route_1 = require("../modules/Profile/profile.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.userRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.authRouter,
    },
    {
        path: "/profile",
        route: profile_route_1.profileRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
