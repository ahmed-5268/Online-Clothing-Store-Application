import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all products
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("❌ Error fetching products:", err);
      return res.status(500).json({ message: "Error fetching products" });
    }
    res.json(results);
  });
});

export default router;
