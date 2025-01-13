"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validation_1 = require("./user.validation");
const fileUploader_1 = require("../../helper/fileUploader");
const router = express_1.default.Router();
// GET:for getting all the users
router.get("/", user_controller_1.default.index);
// POST: for creating new user
router.post("/create", fileUploader_1.upload.single("file"), user_controller_1.default.create);
router.post("/me", user_controller_1.default.getOne);
router.get("/:id/me", user_controller_1.default.getOnesInfo);
// PATCH: for updating users
router.patch("/:id/update", (0, validateRequest_1.requestValidator)(user_validation_1.userValidations.basicUserSchema), user_controller_1.default.patch);
router.post("/:id/account-verification", user_controller_1.default.accountVerification);
router.post("/forget-password", user_controller_1.default.forgetPassword);
router.post("/change-password", user_controller_1.default.changePasswordFunc);
exports.userRoutes = router;
