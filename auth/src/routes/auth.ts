import { Router } from "express";
import { supabase } from "../supabase";

export const authRouter = Router();

function readCredentials(body: unknown) {
  if (typeof body !== "object" || body === null) return null;

  const { email, password } = body as Record<string, unknown>;
  if (
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof password !== "string" ||
    password === ""
  ) {
    return null;
  }

  return { email: email.trim().toLowerCase(), password };
}

authRouter.post("/signup", async (req, res) => {
  const credentials = readCredentials(req.body);
  if (!credentials) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const { data, error } = await supabase.auth.signUp(credentials);

  if (error) {
    // Avoid leaking unnecessary provider internals to clients.
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(201).json({
    user: data.user,
    email_confirmation_required: data.session === null,
  });
});

authRouter.post("/login", async (req, res) => {
  const credentials = readCredentials(req.body);
  if (!credentials) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error || !data.session) {
    // A generic response does not reveal whether an account exists.
    res.status(401).json({ error: "Invalid login credentials" });
    return;
  }

  res.status(200).json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in,
    token_type: data.session.token_type,
  });
});