const express = require("express");
const mysql = require("mysql2");
const db = require("./db");
const app = express();
const port = 3000; // Changed port to 3000

app.use(express.json());

// GET: Read all products
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM tbl_product", (err, products) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Error fetching products" });
    }
    res.json(products);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Running at http://127.0.0.1:${port}/`);
});
