type paginationObj = {
  limit?: number;
  page?: number;
  sortby?: string;
  sortOrder?: string;
};

type paginationResult = {
  limit: number;
  page: number;
  sortby: string;
  sortOrder: string;
  skip: number;
};
export const paginationHelper = (options: paginationObj): paginationResult => {
  const limit: number = Number(options.limit) || 10;
  const page: number = Number(options.page) || 1;
  const sortby: string = "" || "createdAt";
  const sortOrder: string = "" || "desc";

  const skip: number = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    sortby,
    sortOrder,
  };
};

import bcrypt from "bcryptjs";
export const passwordHasher = (value: string): string => {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(value, salt);
  return hash;
};

export const isHashMatched = (
  hashValue: string,
  compareValue: string
): boolean => {
  return bcrypt.compareSync(compareValue, hashValue);
};
import otpGen from "otp-generator";

export const generateOtp = () => {
  return otpGen.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
};

import crypto from "crypto";
export const generateUrlToken = (length: number = 32): string => {
  // Generate a random buffer and convert it to a base64 string
  const token = crypto.randomBytes(length).toString("base64");

  // Make the token URL-safe by replacing unsafe characters
  return token.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
