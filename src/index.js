import express from "express";
import { supabase } from "./config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());

// const { get, post, put, delete: remove } = app;
// const get = app.get.bind(app);
// const post = app.post.bind(app);
// const put = app.put.bind(app);
// const remove = app.delete.bind(app);

app.get("/", async (_req, res) => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch products",
    });
  }

  res.json(data);
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // if (password.length < 8) {
    //   return res.status(400).json({
    //     message: "Password must be at least 8 characters",
    //   });
    // }

    // Check whether the user already exists
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

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

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error: createError } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: passwordHash,
      })
      .select("id, email, created_at")
      .single();

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
});

app.post("/login", async (req, res) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, password_hash")
    .eq("email", email)
    .maybeSingle();

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (passwordMatch) {
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
});

// import jwt from "jsonwebtoken";

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token is required",
      });
    }

    // Expected format:
    // Authorization: Bearer <token>
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make the authenticated user available
    // to the next handler.
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

app.get("/products", async (_req, res) => {
  try {
    const { data, error } = await supabase.from("products").select(`
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
});

app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("products")
            .select(`
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
            `)
            .eq("id", id)
            .single();

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
            images: data.product_images.map(
                (image) => image.image_url
            ),
        };

        res.json(product);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
