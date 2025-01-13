"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidations = void 0;
const zod_1 = require("zod");
const basicUserSchema = zod_1.z.object({
    email: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    needPasswordChange: zod_1.z.boolean().optional(),
    status: zod_1.z.enum(["ACTIVE", "BLOCKED", "DELETED"]).optional(),
});
exports.userValidations = {
    basicUserSchema,
};
