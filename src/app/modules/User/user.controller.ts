import httpStatus from "http-status";
import { SendResponse } from "../../shared/sendResponse";
import { Request, Response, NextFunction } from "express";
import {
  createUser,
  getAllActiveUsers,
  getSingleUserInfo,
  updateUser,
  verifyAccount,
  sendRecoveryEmail,
  changePassword,
  getSingleUserInformation,
} from "./user.service";
import { userFilters } from "./user.constants";
import { pick } from "../../shared/pick";
import tryCatchAsync from "../../shared/tryCatchAsync";
import { isHashMatched, passwordHasher } from "../../helper/helper";
import { User } from "@prisma/client";

class userController {
  static index = tryCatchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, userFilters);
    const options = pick(req.query, ["limit", "page", "sortby", "sortOrder"]);
    const result = await getAllActiveUsers(filter, options);
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Users Fetched Successfully!",
      meta: result.meta,
      data: result.data,
    });
  });
  static create = tryCatchAsync(async (req: Request, res: Response) => {
    let imageFile;

    if (req.file) {
      imageFile = req.file;
    }
    console.log("image from frontend", imageFile);
    const data = req.body;
    console.log("data from browser", data);

    const modifiedPayload: { email: string; password: string,userType:string } = {
      email: data.email as string,
      password: passwordHasher(data.password),
      userType: data.userType
    };

    const { email, password, ...rest } = data;
    const profileData = rest;

    const result = await createUser(modifiedPayload, profileData, imageFile);

    console.log("uploaded user data", result);
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Created Successfully!",
      data: result,
    });
  });
  static patch = tryCatchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      const updateData = req.body;

      const result = await updateUser(updateData, userId);
      SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User of Id ${result.id} Updated Successfully!`,
        data: result,
      });
    }
  );
  static getOne = tryCatchAsync(async (req: Request, res: Response) => {
    const userId = req.body.email;
    const result = await getSingleUserInfo(userId);
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `User verified`,
      data: result,
    });
  });
  static getOnesInfo = tryCatchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await getSingleUserInformation(userId);
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `User verified`,
      data: result,
    });
  });

  static accountVerification = tryCatchAsync(
    async (req: Request, res: Response) => {
      const body = req.body;
      const id = req.params.id;
      console.log("id", id);

      const result = await verifyAccount(id, body);

      SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User verified`,
        data: result,
      });
    }
  );

  static forgetPassword = tryCatchAsync(async (req: Request, res: Response) => {
    const body = req.body;

    const email = req.body.email;
    const result = await sendRecoveryEmail(email);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Recovery Email Sent`,
      data: result,
    });
  });
  static changePasswordFunc = tryCatchAsync(
    async (req: Request, res: Response) => {
      const body = req.body;

      const result = await changePassword(body);

      SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Password Changed`,
        data: result,
      });
    }
  );
}

export default userController;
