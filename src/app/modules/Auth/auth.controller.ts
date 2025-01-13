import { Request, Response } from "express";
import tryCatchAsync from "../../shared/tryCatchAsync";
import { authService } from "./auth.service";
import { SendResponse } from "../../shared/sendResponse";
import httpStatus from "http-status";
import config from "../../config/config";

class AuthController {
  // demo login use
  static login = tryCatchAsync(async (req: Request, res: Response) => {
    const body = req.body;
    // console.log(body);
    const result = await authService.loginUser(body);

    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: (config.NODE_ENV as string) === "dev" ? false : true,
      //   secure: false,
      httpOnly: true,
    });
    SendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully!",
      data: {
        accessToken: result.accessToken,
        needPasswordChange: result.needPasswordChange,
        id: result.id,
        email: result.email,
        userType: result.userType,
      },
    });
  });
}

export default AuthController;
