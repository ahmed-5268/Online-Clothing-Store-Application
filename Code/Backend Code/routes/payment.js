import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
    const { orderId, total } = req.body;
  
    console.log("💳 Payment received for Order:", orderId, "| Total:", total);
  
    if (!orderId || !total) {
      console.log("❌ Invalid payment data:", req.body);
      return res.status(400).json({ success: false, message: "Invalid payment data!" });
    }
  
    res.status(200).json({ success: true, message: "Payment successful!" });
  });
  

export default router;
