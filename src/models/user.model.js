import { supabase } from "../config/database.js";

export async function findUserByEmail(email) {
  return supabase.from("users").select("id").eq("email", email).maybeSingle();
}

export async function findUserForLogin(email) {
  return supabase
    .from("users")
    .select("id, email, password_hash")
    .eq("email", email)
    .maybeSingle();
}

export async function createUser({ email, passwordHash }) {
  return supabase
    .from("users")
    .insert({
      email,
      password_hash: passwordHash,
    })
    .select("id, email, created_at")
    .single();
}
