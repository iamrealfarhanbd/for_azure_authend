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
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.sendRecoveryEmail = exports.verifyAccount = exports.updateUser = exports.createUser = exports.getSingleUserInformation = exports.getSingleUserInfo = exports.getAllActiveUsers = void 0;
const helper_1 = require("../../helper/helper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const user_constants_1 = require("./user.constants");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const config_1 = __importDefault(require("../../config/config"));
const emailSender_1 = require("../../helper/emailSender");
const getAllActiveUsers = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ params, options });
    const { searchTerm } = params, filters = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: user_constants_1.userSearchableFilters.map((fields) => ({
                [fields]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filters).length > 0) {
        andConditions.push({
            AND: Object.keys(filters).map((key) => {
                return {
                    [key]: {
                        equals: filters[key],
                    },
                };
            }),
        });
    }
    andConditions.push({
        status: "ACTIVE",
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const { page, limit, skip, sortby, sortOrder } = (0, helper_1.paginationHelper)(options);
    const data = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip: skip,
        take: limit,
        orderBy: sortby && sortOrder
            ? {
                [sortby]: sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    console.log(data);
    const total = yield prisma_1.default.user.count({
        where: whereConditions,
    });
    const returnData = {
        data: data,
        meta: {
            total,
            page,
            limit,
        },
    };
    return returnData;
});
exports.getAllActiveUsers = getAllActiveUsers;
const getSingleUserInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.profile.findUniqueOrThrow({
        where: {
            email: userId,
        },
    });
});
exports.getSingleUserInfo = getSingleUserInfo;
const getSingleUserInformation = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });
});
exports.getSingleUserInformation = getSingleUserInformation;
const createUser = (userData, profileData, profilePhoto) => __awaiter(void 0, void 0, void 0, function* () {
    let imageUrl;
    if (profilePhoto !== undefined) {
        const formData = new form_data_1.default();
        formData.append("key", config_1.default.IMGBB_KEY); // Replace with your actual API key
        formData.append("image", fs_1.default.createReadStream(profilePhoto === null || profilePhoto === void 0 ? void 0 : profilePhoto.path));
        const response = yield axios_1.default.post("https://api.imgbb.com/1/upload", formData, {
            headers: Object.assign({}, formData.getHeaders()),
        });
        imageUrl = response.data.data;
        // console.log("Image upload result", imageUrl);
        // Extract the image URL from the Imgbb response
    }
    const date = new Date();
    const userVerificationInfo = {
        userVerificationOtp: (0, helper_1.generateOtp)(),
        otpGenTime: date,
    };
    console.log(userVerificationInfo);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createUser = yield transactionClient.user.create({
            data: {
                email: userData.email,
                password: userData.password,
                userType: userData.userType,
                verificationInfo: JSON.stringify(userVerificationInfo),
            },
        });
        console.log("created_user", createUser);
        const createProfile = yield transactionClient.profile.create({
            data: {
                firstName: profileData.firstName || "",
                lastName: profileData.lastName || "",
                email: userData.email || "",
                age: Number(profileData === null || profileData === void 0 ? void 0 : profileData.age) || 18,
                gender: profileData.gender || null,
                pronoun: profileData.pronoun || "",
                profilePhoto: JSON.stringify(imageUrl) || "",
                contactNumber: profileData.contactNumber || "",
                bio: profileData.bio || "",
                preferredContent: profileData.preferredContent,
            },
        });
        return Object.assign(Object.assign({}, createProfile), { id: createUser.id });
    }));
    // console.log("updaed upser",result);
    // console.dir({ userData, profileData }, { depth: Infinity });
    (0, emailSender_1.sendEmail)({
        emailSubject: "Account Verification Code",
        senderEmail: "adil@lilliputdigital.com",
        receiverEmail: userData.email,
        senderName: "React Auth Starter Backend",
    }, "OtpTemplate", { otp: userVerificationInfo.userVerificationOtp });
    return result;
});
exports.createUser = createUser;
const updateUser = (data, Id) => __awaiter(void 0, void 0, void 0, function* () {
    const found = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: Id,
        },
    });
    const patch = yield prisma_1.default.user.update({
        where: {
            id: Id,
        },
        data: data,
    });
    return patch;
});
exports.updateUser = updateUser;
const verifyAccount = (userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("first");
    const userAccountInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userId,
            status: "PENDING",
        },
    });
    console.log({ userAccountInfo });
    const { otp } = body;
    const { verificationInfo } = userAccountInfo;
    const parsedVerificationInfo = JSON.parse(verificationInfo);
    console.log({ parsedVerificationInfo, otp, userAccountInfo });
    if (userAccountInfo.status === "PENDING") {
        if (parsedVerificationInfo.userVerificationOtp === otp) {
            yield prisma_1.default.user.update({
                data: {
                    verificationInfo: "",
                    status: "ACTIVE",
                },
                where: {
                    id: userId,
                },
            });
        }
        else {
            throw new Error("You've entered the wrong verification code!");
        }
    }
});
exports.verifyAccount = verifyAccount;
const sendRecoveryEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userAccountInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: email,
            // status: UserStatus.ACTIVE || "FORGOTPASS",
        },
    });
    const date = new Date();
    const userVerificationInfo = {
        userVerificationOtp: (0, helper_1.generateUrlToken)(),
        urlGenTime: date,
    };
    console.log(userVerificationInfo);
    const result = yield prisma_1.default.user.update({
        where: {
            email: userAccountInfo.email,
        },
        data: {
            verificationInfo: JSON.stringify(userVerificationInfo),
            status: "FORGOTPASS",
        },
    });
    (0, emailSender_1.sendEmail)({
        emailSubject: "Account Verification Code",
        senderEmail: "adil@lilliputdigital.com",
        receiverEmail: userAccountInfo.email,
        senderName: "React Auth Starter Backend",
    }, "ForgetPasswordTemplate", {
        token: userVerificationInfo.userVerificationOtp,
        BASE_URL: "http://localhost:8080",
    });
});
exports.sendRecoveryEmail = sendRecoveryEmail;
const changePassword = (body) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(body);
    const userAccountInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: body.email,
            status: "FORGOTPASS",
        },
    });
    const { verificationInfo } = userAccountInfo;
    const parsedVerificationValue = JSON.parse(verificationInfo);
    // console.log(parsedVerificationValue);
    if (parsedVerificationValue.userVerificationOtp === body.token) {
        yield prisma_1.default.user.update({
            where: {
                email: body.email,
            },
            data: {
                verificationInfo: "",
                status: "ACTIVE",
                password: (0, helper_1.passwordHasher)(body.password),
            },
        });
    }
});
exports.changePassword = changePassword;
