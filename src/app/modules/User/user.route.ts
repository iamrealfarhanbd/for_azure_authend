import express, { NextFunction, Request, Response } from "express";
import userController from "./user.controller";
import { AnyZodObject, z } from "zod";
import { requestValidator } from "../../middlewares/validateRequest";
import { userValidations } from "./user.validation";
import { upload } from "../../helper/fileUploader";

const router = express.Router();

// GET:for getting all the users
router.get("/", userController.index);
// POST: for creating new user
router.post("/create", upload.single("file"), userController.create);
router.post("/me", userController.getOne);
router.get("/:id/me", userController.getOnesInfo);

// PATCH: for updating users
router.patch(
  "/:id/update",
  requestValidator(userValidations.basicUserSchema),
  userController.patch
);

router.post("/:id/account-verification", userController.accountVerification);
router.post("/forget-password", userController.forgetPassword);
router.post("/change-password", userController.changePasswordFunc);

export const userRoutes = router;
