"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendResponse = void 0;
const SendResponse = (res, data) => {
    const responseData = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || null,
        meta: data.meta || null || undefined,
        data: data.data || null || undefined,
    };
    res.status(data.statusCode).json(responseData);
};
exports.SendResponse = SendResponse;
