import express from "express";

import {
  getHomeProducts,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", getHomeProducts);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
