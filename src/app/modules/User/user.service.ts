import {Prisma, Profile, User } from "@prisma/client";
import {
  generateOtp,
  generateUrlToken,
  paginationHelper,
  passwordHasher,
} from "../../helper/helper";
import prisma from "../../shared/prisma";
import { userSearchableFilters } from "./user.constants";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import config from "../../config/config";
import { sendEmail } from "../../helper/emailSender";
export const getAllActiveUsers = async (params: any, options: {}) => {
  console.log({ params, options });

  const { searchTerm, ...filters } = params;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFilters.map((fields) => ({
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

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const { page, limit, skip, sortby, sortOrder } = paginationHelper(options);

  const data = await prisma.user.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy:
      sortby && sortOrder
        ? {
            [sortby]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  console.log(data);

  const total = await prisma.user.count({
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
};

export const getSingleUserInfo = async (userId: string) => {
  return await prisma.profile.findUniqueOrThrow({
    where: {
      email: userId,
    },
  });
};
export const getSingleUserInformation = async (userId: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });
};

export const createUser = async (
  userData: Partial<User>,
  profileData: Profile,
  profilePhoto: any
) => {
  let imageUrl: any;
  if (profilePhoto !== undefined) {
    const formData = new FormData();
    formData.append("key", config.IMGBB_KEY); // Replace with your actual API key
    formData.append("image", fs.createReadStream(profilePhoto?.path));
    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    imageUrl = response.data.data;
    // console.log("Image upload result", imageUrl);

    // Extract the image URL from the Imgbb response
  }
  const date = new Date();
  const userVerificationInfo = {
    userVerificationOtp: generateOtp(),
    otpGenTime: date,
  };
  console.log(userVerificationInfo);
  const result = await prisma.$transaction(async (transactionClient) => {
    const createUser = await transactionClient.user.create({
      data: {
        email: userData.email as string,
        password: userData.password as string,
        userType: userData.userType as string,
        verificationInfo: JSON.stringify(userVerificationInfo),
      },
    });

    console.log("created_user", createUser);

    const createProfile = await transactionClient.profile.create({
      data: {
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: userData.email || "",
        age: Number(profileData?.age) || 18,
        gender: profileData.gender || null,
        pronoun: profileData.pronoun || "",
        profilePhoto: JSON.stringify(imageUrl) || "",
        contactNumber: profileData.contactNumber || "",
        bio: profileData.bio || "",
        preferredContent: profileData.preferredContent,
      },
    });
    return { ...createProfile, id: createUser.id };
  });

  // console.log("updaed upser",result);

  // console.dir({ userData, profileData }, { depth: Infinity });
  sendEmail(
    {
      emailSubject: "Account Verification Code",
      senderEmail: "adil@lilliputdigital.com",
      receiverEmail: userData.email as string,
      senderName: "React Auth Starter Backend",
    },
    "OtpTemplate",
    { otp: userVerificationInfo.userVerificationOtp }
  );

  return result;
};

export const updateUser = async (data: Partial<User>, Id: string) => {
  const found = await prisma.user.findUniqueOrThrow({
    where: {
      id: Id,
    },
  });

  const patch = await prisma.user.update({
    where: {
      id: Id,
    },
    data: data,
  });

  return patch;
};

export const verifyAccount = async (userId: string, body: { otp: string }) => {
  console.log("first");
  const userAccountInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      status: "PENDING",
    },
  });
  console.log({ userAccountInfo });
  const { otp } = body;

  const { verificationInfo } = userAccountInfo;

  const parsedVerificationInfo = JSON.parse(verificationInfo as string);
  console.log({ parsedVerificationInfo, otp, userAccountInfo });

  if (userAccountInfo.status === "PENDING") {
    if (parsedVerificationInfo.userVerificationOtp === otp) {
      await prisma.user.update({
        data: {
          verificationInfo: "",
          status: "ACTIVE",
        },
        where: {
          id: userId,
        },
      });
    } else {
      throw new Error("You've entered the wrong verification code!");
    }
  }
};

export const sendRecoveryEmail = async (email: string) => {
  const userAccountInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
      // status: UserStatus.ACTIVE || "FORGOTPASS",
    },
  });
  const date = new Date();
  const userVerificationInfo = {
    userVerificationOtp: generateUrlToken(),
    urlGenTime: date,
  };
  console.log(userVerificationInfo);

  const result = await prisma.user.update({
    where: {
      email: userAccountInfo.email,
    },
    data: {
      verificationInfo: JSON.stringify(userVerificationInfo),
      status: "FORGOTPASS",
    },
  });

  sendEmail(
    {
      emailSubject: "Account Verification Code",
      senderEmail: "adil@lilliputdigital.com",
      receiverEmail: userAccountInfo.email as string,
      senderName: "React Auth Starter Backend",
    },
    "ForgetPasswordTemplate",
    {
      token: userVerificationInfo.userVerificationOtp,
      BASE_URL: "http://localhost:8080",
    }
  );
};

export const changePassword = async (body: {
  email: string;
  password: string;
  token: string;
}) => {
  // console.log(body);
  const userAccountInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: body.email,
      status: "FORGOTPASS",
    },
  });

  const { verificationInfo } = userAccountInfo;
  const parsedVerificationValue = JSON.parse(verificationInfo as string);
  // console.log(parsedVerificationValue);

  if (parsedVerificationValue.userVerificationOtp === body.token) {
    await prisma.user.update({
      where: {
        email: body.email,
      },
      data: {
        verificationInfo: "",
        status: "ACTIVE",
        password: passwordHasher(body.password),
      },
    });
  }
};
