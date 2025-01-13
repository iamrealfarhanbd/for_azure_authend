import { Request, Response } from "express";
import { generateOtp, isHashMatched } from "../../helper/helper";
import prisma from "../../shared/prisma";
import jwt, { Secret } from "jsonwebtoken";
import config from "../../config/config";

const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });

  return token;
};
const loginUser = async (payload: { email: string; password: string }) => {
  const found = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: "ACTIVE" || "PENDING",
    },
  });
  const matched = isHashMatched(found.password, payload.password);
  if (matched === false) {
    throw new Error("Password Incorrect!");
  }
  const accessToken = generateToken(
    { email: payload.email },
    config.ACCESS_TOKEN_SECRET as Secret,
    config.EXPIRES_IN as string
  );
  const refreshToken = generateToken(
    { email: payload.email },
    config.ACCESS_TOKEN_SECRET as Secret,
    config.REFRESH_TOKEN_EXPIRES_IN as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: found.needPasswordChange,
    id: found.id,
    email: found.email,
    userType: found.userType,
  };
};

const verifyAccount = async () => {
  console.log("verify account");
};

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

export const authService = {
  loginUser,
  verifyAccount,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
