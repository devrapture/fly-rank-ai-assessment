import type { NextFunction, Request, Response } from "express";
import { supabase } from "../supabase";
import "../types";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.header("authorization");
  const [scheme, token, extra] = authorization?.trim().split(/\s+/) ?? [];

  if (scheme?.toLowerCase() !== "bearer" || !token || extra) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  req.user = data.user;
  req.accessToken = token;
  next();
}