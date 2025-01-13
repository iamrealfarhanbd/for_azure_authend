import { z } from "zod";

const basicUserSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),

  needPasswordChange: z.boolean().optional(),
  status: z.enum(["ACTIVE", "BLOCKED", "DELETED"]).optional(),
});

export const userValidations = {
  basicUserSchema,
};
