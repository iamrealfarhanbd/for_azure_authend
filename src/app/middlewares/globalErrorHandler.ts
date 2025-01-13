import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const globalErrorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({
    success: false,
    error: {
      message: error.message,
      error: error,
    },
  });
};

export default globalErrorHandler;
