import express from "express";
const router = express.Router();

router.post("/checkout", (req, res) => {
  const { cart } = req.body;
  console.log("Checkout request received:", cart);

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty or invalid!" });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.status(200).json({
    message: "Checkout successful!",
    orderId: Math.floor(Math.random() * 10000),
    total,
  });
});

export default router;
