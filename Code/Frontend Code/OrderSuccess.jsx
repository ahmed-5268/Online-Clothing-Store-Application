import React from "react";
import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>✅ Payment Successful!</h1>
      <p>Thank you for your purchase. Your order will be processed soon.</p>
      <Link
        to="/"
        style={{
          marginTop: "20px",
          display: "inline-block",
          backgroundColor: "#1E3A8A",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          textDecoration: "none",
        }}
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default OrderSuccess;
