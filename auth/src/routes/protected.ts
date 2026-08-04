import { Router } from "express";
import { supabase } from "../supabase";

export const protectedRouter = Router();

protectedRouter.get("/profile", async (req, res) => {
  const authorization = req.header("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  res.status(200).json({
    id: data.user.id,
    email: data.user.email,
    created_at: data.user.created_at,
  });
});