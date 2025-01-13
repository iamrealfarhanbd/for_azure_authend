"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = (error, req, res, next) => {
    res.status(500).json({
        success: false,
        error: {
            message: error.message,
            error: error,
        },
    });
};
exports.default = globalErrorHandler;
