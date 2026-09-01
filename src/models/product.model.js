import { supabase } from "../config/database.js";

export async function getAllProducts() {
  return supabase.from("products").select(`
    id,
    name,
    price,

    categories (
      id,
      name
    ),

    product_images (
      image_url
    )
  `);
}

export async function getProductById(id) {
  return supabase
    .from("products")
    .select(
      `
        id,
        name,
        description,
        price,
        categories (
          name
        ),
        product_images (
          image_url
        )
      `,
    )
    .eq("id", id)
    .single();
}

export async function getProductsForGrid() {
  return supabase
    .from("products")
    .select(
      `
        id,
        name,
        description,
        price,

        categories (
          id,
          name
        ),

        product_images (
          image_url,
          is_primary
        )
      `,
    )
    .order("is_primary", {
      foreignTable: "product_images",
      ascending: false,
    });
}

export async function createProduct({ name, description, price, category_id }) {
  return supabase
    .from("products")
    .insert({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category_id: Number(category_id),
    })
    .select(
      `
        id,
        name,
        description,
        price,
        category_id
      `,
    )
    .single();
}

export async function saveProductImages(imageRows) {
  return supabase.from("product_images").insert(imageRows).select();
}

export async function deleteProductById(id) {
  return supabase.from("products").delete().eq("id", id);
}
