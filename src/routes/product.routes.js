import express from "express";
import multer from "multer";

import { authenticate } from "../middleware/authenticate.js";
import {
  createProductController,
  getProductByIdController,
  getProducts,
  getProductsForGridRoute,
} from "../controllers/product.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 6,
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.get("/products", getProducts);
router.get("/products/:id", getProductByIdController);
router.post(
  "/products",
  authenticate,
  upload.array("images", 6),
  createProductController,
);
router.get("/getproducts", getProductsForGridRoute);

export default router;
