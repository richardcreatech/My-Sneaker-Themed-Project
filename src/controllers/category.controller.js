import {
  createCategory,
  findCategoryByName,
  getCategories,
} from "../models/category.model.js";

export async function getCategoriesController(_req, res) {
  try {
    const categories = await getCategories();
    res.json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
}

export async function createCategoryController(req, res) {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const { data: existingCategory, error: existingError } =
      await findCategoryByName(name.trim());

    if (existingError) {
      console.error(existingError);

      return res.status(500).json({
        message: "Failed to check category",
      });
    }

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists",
        categories: await getCategories(),
        category: existingCategory,
      });
    }

    const { data: category, error: createError } = await createCategory({
      name,
      description,
    });

    if (createError) {
      console.error(createError);

      return res.status(500).json({
        message: "Failed to create category",
      });
    }

    const categories = await getCategories();

    return res.status(201).json({
      message: "Category created successfully",
      category,
      categories,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
