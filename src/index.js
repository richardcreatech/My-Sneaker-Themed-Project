import express from "express";
import { supabase } from "./config/database.js";

const app = express();

app.get("/", async (_req, res) => {
    const { data, error } = await supabase
        .from("products")
        .select("*");

    if (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch products"
        });
    }

    res.json(data);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});