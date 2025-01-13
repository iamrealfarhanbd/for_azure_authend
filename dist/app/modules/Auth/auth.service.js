"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const helper_1 = require("../../helper/helper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn,
    });
    return token;
};
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const found = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: "ACTIVE" || "PENDING",
        },
    });
    const matched = (0, helper_1.isHashMatched)(found.password, payload.password);
    if (matched === false) {
        throw new Error("Password Incorrect!");
    }
    const accessToken = generateToken({ email: payload.email }, config_1.default.ACCESS_TOKEN_SECRET, config_1.default.EXPIRES_IN);
    const refreshToken = generateToken({ email: payload.email }, config_1.default.ACCESS_TOKEN_SECRET, config_1.default.REFRESH_TOKEN_EXPIRES_IN);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: found.needPasswordChange,
        id: found.id,
        email: found.email,
        userType: found.userType,
    };
});
const verifyAccount = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("verify account");
});
const refreshToken = () => {
    console.log("Refresh token");
};
const changePassword = () => {
    console.log("Refresh token");
};
const forgetPassword = () => {
    console.log("Refresh token");
};
const resetPassword = () => {
    console.log("Refresh token");
};
exports.authService = {
    loginUser,
    verifyAccount,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
