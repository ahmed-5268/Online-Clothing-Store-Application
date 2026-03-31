import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./ProductMenu.module.css";

const ProductMenu = ({ addToCart }) => {
  const [products, setProducts] = useState([]);      // fetched products
  const [category, setCategory] = useState("All");   // selected filter

  // Fetch products from backend when component loads
  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("❌ Error fetching products:", err);
        // fallback: if backend not running, show empty or mock data
        setProducts([]);
      });
  }, []);

  // Filter by category (same as before)
  const filteredProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);

  return (
    <div>
      <h1 className={style.productmenu_heading}>"Choose Style, Not Just Clothes"</h1>

      <div className={style.filter_section}>
        <label className={style.filter_label}>Filter by Category:</label>
        <select
          className={style.filter_select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Computers">Computers</option>
          <option value="Phones">Phones</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      <div className={style.productitems}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className={style.productitem} key={product.id}>
              <img
                src={product.image || "/images/default.png"}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>
                <strong>${product.price}</strong>
              </p>
              <button
                className={style.primary}
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductMenu;
