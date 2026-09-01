import { supabase } from "../config/database.js";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, description")
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function findCategoryByName(name) {
  return supabase
    .from("categories")
    .select("id, name")
    .ilike("name", name)
    .maybeSingle();
}

export async function findCategoryById(id) {
  return supabase
    .from("categories")
    .select("id, name")
    .eq("id", Number(id))
    .maybeSingle();
}

export async function createCategory({ name, description }) {
  return supabase
    .from("categories")
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
    })
    .select("id, name, description")
    .single();
}
