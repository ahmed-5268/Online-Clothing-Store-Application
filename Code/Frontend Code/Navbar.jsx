import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

function Navbar({ cart }) {
  return (
    <nav className="navbar">
      <ul className="navbar__list">
        <li className="navbar__item">
          <Link to="/" className="navbar__link">
            Online Clothes Shopping App
          </Link>
        </li>
        <li className="navbar__item">
          <Link to="/cart" className="navbar__link">
            Cart ({cart.length})
          </Link>
        </li>
        <li className="navbar__item">
          <Link to="/checkout" className="navbar__link">
            Checkout
          </Link>
        </li>
        <li className="navbar__item">
          <Link to="/feedback" className="navbar__link">
            Feedback
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
