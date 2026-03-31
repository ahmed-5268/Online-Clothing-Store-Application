import React from "react";
import axios from "axios";

const Cart = ({ cart, updateCartItemQuantity, removeFromCart }) => {
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // ✅ Checkout + Payment function
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }

    try {
      // Step 1: Checkout
      const response = await axios.post("http://localhost:5000/checkout", {
        cartItems: cart,
      });

      if (response.data.success) {
        alert("🎉 Checkout successful! Processing payment...");

        const orderId = response.data.orderId;

        // Step 2: Wait and confirm payment automatically
        setTimeout(async () => {
          try {
            const paymentRes = await axios.post(
              "http://localhost:5000/payment",
              { orderId }
            );

            if (paymentRes.data.success) {
              alert("✅ Payment successful! Your order is confirmed.");
            } else {
              alert("⚠️ Payment still processing. Please check again later.");
            }
          } catch (err) {
            console.error("Payment check error:", err);
            alert("❌ Payment verification failed. Try again later.");
          }
        }, 3000); // Wait 3 seconds for backend update
      } else {
        alert("❌ Checkout failed! Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("⚠️ Checkout failed due to a server error.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Cart</h1>

      {cart.length === 0 ? (
        <p style={styles.emptyCart}>Your cart is empty!</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              <div style={styles.itemInfo}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemPrice}>
                  ${item.price} × {item.quantity}
                </p>
              </div>
              <div style={styles.itemActions}>
                <button
                  style={styles.button}
                  onClick={() => updateCartItemQuantity(item.id, -1)}
                >
                  −
                </button>
                <button
                  style={styles.button}
                  onClick={() => updateCartItemQuantity(item.id, 1)}
                >
                  +
                </button>
                <button
                  style={{ ...styles.button, backgroundColor: "#e74c3c" }}
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h2 style={styles.totalPrice}>
            Total Price: ${totalPrice.toFixed(2)}
          </h2>

          <button style={styles.checkoutButton} onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

// 💅 Styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    color: "#1E3A8A",
    marginBottom: "20px",
  },
  emptyCart: {
    textAlign: "center",
    fontSize: "20px",
    color: "#999",
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    marginBottom: "10px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  itemInfo: {
    maxWidth: "60%",
  },
  itemName: {
    fontSize: "20px",
    margin: "0",
    color: "#333",
  },
  itemPrice: {
    fontSize: "16px",
    color: "#555",
  },
  itemActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  button: {
    padding: "8px 15px",
    backgroundColor: "#1E3A8A",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  totalPrice: {
    textAlign: "right",
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "20px",
    color: "#1E3A8A",
  },
  checkoutButton: {
    display: "block",
    width: "100%",
    marginTop: "30px",
    padding: "15px",
    backgroundColor: "#16a085",
    color: "#fff",
    fontSize: "18px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default Cart;
