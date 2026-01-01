require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// MySQL Connection
// ===============================
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

db.connect((err) => {
  if (err) console.log("MySQL Error:", err);
  else console.log("MySQL connected");
});

// ===============================
// Static Images
// ===============================
app.use("/images", express.static("images"));

// ===============================
// REGISTER
// ===============================
app.post("/addUser", (req, res) => {
  const { username, email, password, mobileNumber, address } = req.body;

  const q =
    "INSERT INTO users (username, email, password, mobileNumber, address) VALUES (?,?,?,?,?)";

  db.query(q, [username, email, password, mobileNumber, address], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// ===============================
// LOGIN
// ===============================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const q =
    "SELECT id, username, email FROM users WHERE email=? AND password=?";

  db.query(q, [email, password], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length > 0) {
      res.json({
        success: true,
        message: "Login successful",
        user: data[0],
      });
    } else {
      res.json({ success: false, message: "Wrong email or password" });
    }
  });
});

// ===============================
// CATEGORIES
// ===============================
app.get("/categories", (req, res) => {
  db.query("SELECT * FROM categories", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// ===============================
// PRODUCTS
// ===============================
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.get("/products/category/:id", (req, res) => {
  db.query(
    "SELECT * FROM products WHERE category_id=?",
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    }
  );
});

// ===============================
// CONTACT
// ===============================
app.post("/contact", (req, res) => {
  const { name, email, feedback } = req.body;

  const q = "INSERT INTO contact (name, email, feedback) VALUES (?,?,?)";

  db.query(q, [name, email, feedback], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// ===============================
// CART (FIXED)
// ===============================
app.post("/cart", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  console.log("ADD TO CART BODY:", req.body);

  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ message: "Missing data" });
  }

  const checkSql = "SELECT * FROM cart WHERE user_id=? AND product_id=?";
  db.query(checkSql, [user_id, product_id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      db.query(
        "UPDATE cart SET quantity = quantity + ? WHERE id=?",
        [quantity, result[0].id],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.json({ message: "Cart updated" });
        }
      );
    } else {
      db.query(
        "INSERT INTO cart (user_id, product_id, quantity, size) VALUES (?,?,?,?)",
        [user_id, product_id, quantity, "M"],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.json({ message: "Added to cart" });
        }
      );
    }
  });
});

// ===============================
// GET CART (FIXED)
// ===============================
app.get("/cart/:userId", (req, res) => {
  const sql = `
    SELECT 
      cart.id AS cart_id,
      cart.quantity,
      products.product_id,
      products.name,
      products.price,
      products.image
    FROM cart
    JOIN products ON cart.product_id = products.product_id
    WHERE cart.user_id = ?
  `;

  db.query(sql, [req.params.userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ===============================
// UPDATE CART
// ===============================
app.put("/cart/:cartId", (req, res) => {
  const { quantity } = req.body;

  db.query(
    "UPDATE cart SET quantity=? WHERE id=?",
    [quantity, req.params.cartId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Quantity updated" });
    }
  );
});

// ===============================
// DELETE CART ITEM
// ===============================
app.delete("/cart/:cartId", (req, res) => {
  db.query("DELETE FROM cart WHERE id=?", [req.params.cartId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Item removed" });
  });
});

// ===============================
// ORDER (FIXED)
// ===============================
app.post("/order", (req, res) => {
  const { user_id, address, mobileNumber } = req.body;

  const cartSql = `
    SELECT cart.product_id, cart.quantity, products.price
    FROM cart
    JOIN products ON cart.product_id = products.product_id
    WHERE cart.user_id = ?
  `;

  db.query(cartSql, [user_id], (err, cartItems) => {
    if (err) return res.status(500).json(err);
    if (cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    db.query(
      "INSERT INTO orders (user_id, total_price) VALUES (?,?)",
      [user_id, totalPrice],
      (err2, orderResult) => {
        if (err2) return res.status(500).json(err2);

        const values = cartItems.map((i) => [
          orderResult.insertId,
          i.product_id,
          i.quantity,
          i.price,
          "M",
        ]);

        db.query(
          "INSERT INTO order_items (order_id, product_id, quantity, price, size) VALUES ?",
          [values],
          (err3) => {
            if (err3) return res.status(500).json(err3);

            db.query("DELETE FROM cart WHERE user_id=?", [user_id]);
            res.json({ success: true, message: "Order submitted successfully" });
          }
        );
      }
    );
  });
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
