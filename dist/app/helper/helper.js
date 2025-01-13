"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUrlToken = exports.generateOtp = exports.isHashMatched = exports.passwordHasher = exports.paginationHelper = void 0;
const paginationHelper = (options) => {
    const limit = Number(options.limit) || 10;
    const page = Number(options.page) || 1;
    const sortby = "" || "createdAt";
    const sortOrder = "" || "desc";
    const skip = (page - 1) * limit;
    return {
        page,
        limit,
        skip,
        sortby,
        sortOrder,
    };
};
exports.paginationHelper = paginationHelper;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passwordHasher = (value) => {
    var salt = bcryptjs_1.default.genSaltSync(10);
    var hash = bcryptjs_1.default.hashSync(value, salt);
    return hash;
};
exports.passwordHasher = passwordHasher;
const isHashMatched = (hashValue, compareValue) => {
    return bcryptjs_1.default.compareSync(compareValue, hashValue);
};
exports.isHashMatched = isHashMatched;
const otp_generator_1 = __importDefault(require("otp-generator"));
const generateOtp = () => {
    return otp_generator_1.default.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
};
exports.generateOtp = generateOtp;
const crypto_1 = __importDefault(require("crypto"));
const generateUrlToken = (length = 32) => {
    // Generate a random buffer and convert it to a base64 string
    const token = crypto_1.default.randomBytes(length).toString("base64");
    // Make the token URL-safe by replacing unsafe characters
    return token.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
exports.generateUrlToken = generateUrlToken;
