import "dotenv/config";

function required(name: "SUPABASE_URL" | "SUPABASE_KEY"): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export const config = {
  supabaseUrl: required("SUPABASE_URL"),
  supabaseKey: required("SUPABASE_KEY"),
  port: Number(process.env.PORT ?? 3000),
};