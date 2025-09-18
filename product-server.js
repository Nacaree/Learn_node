const express = require("express");
const app = express();
const fs = require("fs").promises;
const db = require("./db");

app.use(express.json());
const port = 3307;

// GET: Read all products
app.get("/", async (req, res) => {
  try {
    db.query("SELECT * FROM tbl_product"),
      (err, products) => {
        if (err) {
          return res.status(500).send("Database error");
        }
      };
    // const data = await fs.readFile("db.json", "utf8");
    // const products = JSON.parse(data).products;
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "can't get products" });
  }
});

// GET: Read a single product by pid
app.get("/api/products/:pid", async (req, res) => {
  try {
    const data = await fs.readFile("db.json", "utf8");
    const products = JSON.parse(data).products;
    const pid = parseInt(req.params.pid, 10);

    const product = products.find((p) => p.pid === pid);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error reading product" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Running at http://127.0.0.1:${port}/`);
});
