import { supabase } from "../config/database.js";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  getProductsForGrid,
  saveProductImages,
} from "../models/product.model.js";
import { findCategoryById } from "../models/category.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export async function getProducts(_req, res) {
  try {
    const { data, error } = await getAllProducts();

    if (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to fetch products",
      });
    }

    const products = data.map((product) => {
      const images = product.product_images;

      const randomImage =
        images.length > 0
          ? images[Math.floor(Math.random() * images.length)]
          : null;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.categories?.name ?? null,
        image: randomImage?.image_url ?? null,
      };
    });

    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getProductByIdController(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await getProductById(id);

    if (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to fetch product",
      });
    }

    if (!data) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.categories?.name ?? null,
      images: data.product_images.map((image) => image.image_url),
    };

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function createProductController(req, res) {
  try {
    const { name, description, price, category_id } = req.body;
    const files = req.files;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        message: "Product description is required",
      });
    }

    if (!price) {
      return res.status(400).json({
        message: "Product price is required",
      });
    }

    if (!category_id) {
      return res.status(400).json({
        message: "Product category is required",
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "At least one product image is required",
      });
    }

    const { data: category, error: categoryError } =
      await findCategoryById(category_id);

    if (categoryError) {
      console.error(categoryError);

      return res.status(500).json({
        message: "Failed to verify category",
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "Selected category does not exist",
      });
    }

    const uploadedImages = await Promise.all(
      files.map((file) => uploadToCloudinary(file)),
    );

    const { data: product, error: productError } = await createProduct({
      name,
      description,
      price,
      category_id,
    });

    if (productError) {
      console.error(productError);

      return res.status(500).json({
        message: "Failed to create product",
      });
    }

    const imageRows = uploadedImages.map((image, index) => ({
      product_id: product.id,
      image_url: image.secure_url,
      is_primary: index === 0,
    }));

    const { data: productImages, error: imageError } =
      await saveProductImages(imageRows);

    if (imageError) {
      console.error(imageError);

      await deleteProductById(product.id);

      return res.status(500).json({
        message: "Product created but images could not be saved",
      });
    }

    return res.status(201).json({
      message: "Product created successfully",
      product: {
        ...product,
        category: {
          id: category.id,
          name: category.name,
        },
        images: productImages,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getProductsForGridRoute(_req, res) {
  try {
    const { data, error } = await getProductsForGrid();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch products" });
    }

    const products = data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,

      category: product.categories
        ? { id: product.categories.id, name: product.categories.name }
        : null,

      images: product.product_images.map((img) => img.image_url),
    }));

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
