import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔒 Mutex-like lock to avoid race conditions
let isUpdatingStock = false;
async function safeUpdateStock(callback) {
  while (isUpdatingStock) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  isUpdatingStock = true;
  try {
    await callback();
  } finally {
    isUpdatingStock = false;
  }
}

// ✅ Fetch all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Checkout Route
app.post("/checkout", async (req, res) => {
  const { cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  try {
    await safeUpdateStock(async () => {
      db.beginTransaction((err) => {
        if (err) throw err;

        console.log("🛒 Checkout request received:", cartItems);

        const ids = cartItems.map((i) => i.id);
        db.query(
          "SELECT id, stock FROM products WHERE id IN (?)",
          [ids],
          (err, products) => {
            if (err) {
              db.rollback();
              return res.status(500).json({ success: false, message: "Database error" });
            }

            // Validate stock
            let allAvailable = true;
            for (const item of cartItems) {
              const product = products.find((p) => p.id === item.id);
              if (!product || product.stock < item.quantity) {
                allAvailable = false;
                break;
              }
            }

            if (!allAvailable) {
              db.rollback();
              return res.status(400).json({
                success: false,
                message: "Some products are out of stock",
              });
            }

            // Calculate total
            const total = cartItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            // Create order
            db.query(
              "INSERT INTO orders (total, status) VALUES (?, 'Pending')",
              [total],
              (err, orderResult) => {
                if (err) {
                  db.rollback();
                  return res.status(500).json({ success: false, message: "Order creation failed" });
                }

                const orderId = orderResult.insertId;

                // Insert order items
                const orderItemsValues = cartItems.map((item) => [
                  orderId,
                  item.id,
                  item.quantity,
                ]);

                db.query(
                  "INSERT INTO order_items (order_id, product_id, quantity) VALUES ?",
                  [orderItemsValues],
                  (err) => {
                    if (err) {
                      db.rollback();
                      return res.status(500).json({ success: false, message: "Order items failed" });
                    }

                    // Update stock
                    const updatePromises = cartItems.map(
                      (item) =>
                        new Promise((resolve, reject) => {
                          db.query(
                            "UPDATE products SET stock = stock - ? WHERE id = ?",
                            [item.quantity, item.id],
                            (err) => (err ? reject(err) : resolve())
                          );
                        })
                    );

                    Promise.all(updatePromises)
                      .then(() => {
                        db.commit((err) => {
                          if (err) {
                            db.rollback();
                            return res.status(500).json({ success: false, message: "Commit failed" });
                          }

                          console.log(`✅ Order ${orderId} created | Total: ${total}`);

                          // Simulate async payment confirmation after 3s
                          setTimeout(() => {
                            db.query(
                              "UPDATE orders SET status = 'Completed' WHERE id = ?",
                              [orderId],
                              (err) => {
                                if (err) console.error("Error updating order status:", err);
                                else console.log(`💳 Payment confirmed for Order: ${orderId}`);
                              }
                            );
                          }, 3000);

                          res.json({
                            success: true,
                            message: "Checkout successful! Payment is being processed.",
                            orderId,
                            total,
                          });
                        });
                      })
                      .catch((err) => {
                        console.error("Stock update error:", err);
                        db.rollback();
                        res.status(500).json({ success: false, message: "Stock update failed" });
                      });
                  }
                );
              }
            );
          }
        );
      });
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ success: false, message: "Checkout failed" });
  }
});

// ✅ Payment confirmation route
app.post("/payment", (req, res) => {
  const { orderId } = req.body;

  db.query("SELECT total, status FROM orders WHERE id = ?", [orderId], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).json({ success: false, message: "Order not found" });

    const order = results[0];
    if (order.status === "Completed") {
      console.log(`💰 Payment received for Order: ${orderId} | Total: ${order.total}`);
      res.json({
        success: true,
        message: `Order confirmed successfully! Your order ID is ${orderId} and total was $${order.total}.`,
      });
    } else {
      res.json({
        success: false,
        message: "Payment still processing... please wait a few seconds.",
      });
    }
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


