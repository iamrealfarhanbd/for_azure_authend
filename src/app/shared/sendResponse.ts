import { Response } from "express";
import { SendResponseResult } from "../interfaces/shared";

export const SendResponse = <T>(
  res: Response,
  data: SendResponseResult<T>
): void => {
  const responseData: SendResponseResult<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || null || undefined,
    data: data.data || null || undefined,
  };
  res.status(data.statusCode).json(responseData);
};
