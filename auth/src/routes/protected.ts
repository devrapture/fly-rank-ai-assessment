import { Router } from "express";

export const protectedRouter = Router();

protectedRouter.get("/profile", (req, res) => {
  const authorization = req.header("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  // Token verification is added in Stage 3.
  res.status(501).json({ error: "Token verification not implemented yet" });
});