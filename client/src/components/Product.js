import React from "react";
import "../styles/Products.css";

const Product = ({ product, addToCart }) => {
  const isLoggedIn = localStorage.getItem("user_id");

  return (
    <div className="productItem">
      <div className="productImage">
        <img src={`http://localhost:5000/images/${product.image}`} alt={product.name} />
      </div>

      <div className="productInfo">
        <h3>{product.name}</h3>
        <p className="productDesc">{product.description}</p>
        <p className="productPrice">${product.price}</p>
        <p className="productQty">{product.quantity > 0 ? "In Stock" : "Out of Stock"}</p>

        <button
          disabled={!isLoggedIn || product.quantity === 0}
          onClick={() => addToCart(product)}
        >
          {!isLoggedIn ? "Login to Add" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default Product;
