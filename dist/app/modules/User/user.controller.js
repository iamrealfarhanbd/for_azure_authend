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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = require("../../shared/sendResponse");
const user_service_1 = require("./user.service");
const user_constants_1 = require("./user.constants");
const pick_1 = require("../../shared/pick");
const tryCatchAsync_1 = __importDefault(require("../../shared/tryCatchAsync"));
const helper_1 = require("../../helper/helper");
class userController {
}
_a = userController;
userController.index = (0, tryCatchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.pick)(req.query, user_constants_1.userFilters);
    const options = (0, pick_1.pick)(req.query, ["limit", "page", "sortby", "sortOrder"]);
    const result = yield (0, user_service_1.getAllActiveUsers)(filter, options);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Users Fetched Successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
userController.create = (0, tryCatchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let imageFile;
    if (req.file) {
        imageFile = req.file;
    }
    console.log("image from frontend", imageFile);
    const data = req.body;
    console.log("data from browser", data);
    const modifiedPayload = {
        email: data.email,
        password: (0, helper_1.passwordHasher)(data.password),
        userType: data.userType
    };
    const { email, password } = data, rest = __rest(data, ["email", "password"]);
    const profileData = rest;
    const result = yield (0, user_service_1.createUser)(modifiedPayload, profileData, imageFile);
    console.log("uploaded user data", result);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Created Successfully!",
        data: result,
    });
}));
userController.patch = (0, tryCatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const updateData = req.body;
    const result = yield (0, user_service_1.updateUser)(updateData, userId);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User of Id ${result.id} Updated Successfully!`,
        data: result,
    });
}));
userController.getOne = (0, tryCatchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.email;
    const result = yield (0, user_service_1.getSingleUserInfo)(userId);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User verified`,
        data: result,
    });
}));
userController.getOnesInfo = (0, tryCatchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield (0, user_service_1.getSingleUserInformation)(userId);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User verified`,
        data: result,
    });
}));
userController.accountVerification = (0, tryCatchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const id = req.params.id;
    console.log("id", id);
    const result = yield (0, user_service_1.verifyAccount)(id, body);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User verified`,
        data: result,
    });
}));
userController.forgetPassword = (0, tryCatchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const email = req.body.email;
    const result = yield (0, user_service_1.sendRecoveryEmail)(email);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Recovery Email Sent`,
        data: result,
    });
}));
userController.changePasswordFunc = (0, tryCatchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = yield (0, user_service_1.changePassword)(body);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Password Changed`,
        data: result,
    });
}));
exports.default = userController;
