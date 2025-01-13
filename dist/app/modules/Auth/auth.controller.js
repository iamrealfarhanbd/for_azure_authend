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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tryCatchAsync_1 = __importDefault(require("../../shared/tryCatchAsync"));
const auth_service_1 = require("./auth.service");
const sendResponse_1 = require("../../shared/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config/config"));
class AuthController {
}
_a = AuthController;
// demo login use
AuthController.login = (0, tryCatchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    // console.log(body);
    const result = yield auth_service_1.authService.loginUser(body);
    const { refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.NODE_ENV === "dev" ? false : true,
        //   secure: false,
        httpOnly: true,
    });
    (0, sendResponse_1.SendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User Logged In Successfully!",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange,
            id: result.id,
            email: result.email,
            userType: result.userType,
        },
    });
}));
exports.default = AuthController;
