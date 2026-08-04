import { Router } from "express";

export const publicRouter = Router();

publicRouter.get("/info", (_req, res) => {
  res.status(200).json({
    message: "Welcome stranger! This info is public.",
  });
});