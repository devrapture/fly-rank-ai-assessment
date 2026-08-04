import { Router } from "express";
import { requireAuth } from "../middleware/require-auth";
import "../types";

export const protectedRouter = Router();

protectedRouter.get("/profile", requireAuth, (req, res) => {
  const user = req.user!;
  res.status(200).json({
    id: user.id,
    email: user.email,
    created_at: user.created_at,
  });
});

protectedRouter.get("/dashboard", requireAuth, (req, res) => {
  res.status(200).json({
    message: `Welcome to your dashboard, ${req.user!.email}`,
  });
});