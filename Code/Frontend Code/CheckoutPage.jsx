import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CheckoutPage({ cart, clearCart }) {
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      // Checkout request
      const res = await axios.post("http://localhost:5000/checkout", { cartItems: cart });
      console.log("Checkout response:", res.data);

      // Simulate payment
      const paymentRes = await axios.post("http://localhost:5000/payment", {
        orderId: res.data.orderId || Date.now(),
        total: res.data.total || calculateTotal(),
      });

      if (paymentRes.data.success) {
        clearCart();
        localStorage.removeItem("cart");
        navigate("/order-success");
      } else {
        alert("❌ Payment failed!");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>Checkout Summary</h2>
      <div style={{ maxWidth: "600px", margin: "20px auto", textAlign: "left" }}>
        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #ccc",
              padding: "10px 0",
            }}
          >
            <span>{item.name} (x{item.quantity})</span>
            <strong>${item.price * item.quantity}</strong>
          </div>
        ))}
        <h3 style={{ marginTop: "20px" }}>Total: ${calculateTotal().toFixed(2)}</h3>
      </div>
      <button
        style={{
          padding: "12px 24px",
          backgroundColor: "#1E3A8A",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "18px",
        }}
        onClick={handleCheckout}
      >
        Confirm Payment
      </button>
    </div>
  );
}

export default CheckoutPage;
