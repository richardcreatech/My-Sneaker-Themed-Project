import express from "express";

import { authenticate } from "../middleware/authenticate.js";
import {
  createCategoryController,
  getCategoriesController,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/categories", getCategoriesController);
router.post("/categories", authenticate, createCategoryController);

export default router;
