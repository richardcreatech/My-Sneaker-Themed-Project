import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { supabase } from "../config/database.js";
import {
  createUser,
  findUserByEmail,
  findUserForLogin,
} from "../models/user.model.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 60 * 60 * 1000,
};

export async function signup(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const { data: existingUser, error: findError } =
      await findUserByEmail(email);

    if (findError) {
      console.error(findError);

      return res.status(500).json({
        message: "Could not check user",
      });
    }

    if (existingUser) {
      return res.status(409).json({
        message: "A user with that email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: user, error: createError } = await createUser({
      email,
      passwordHash,
    });

    if (createError) {
      console.error(createError);

      return res.status(500).json({
        message: "Could not create user",
      });
    }

    return res.status(201).json({
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const { data: user, error } = await findUserForLogin(email);

    if (error) {
      console.error("Supabase error:", error);

      return res.status(500).json({
        message: "Could not find user",
      });
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export function logout(_req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
}

export async function getHomeProducts(_req, res) {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch products",
    });
  }

  res.json(data);
}
