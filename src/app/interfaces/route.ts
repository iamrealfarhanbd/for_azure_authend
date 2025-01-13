import { Router } from "express";

export type ModuleType = {
  path: string;
  route: Router;
};
