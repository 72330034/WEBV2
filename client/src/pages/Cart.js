import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Cart.css";

const Cart = () => {
  const userId = localStorage.getItem("user_id");
  const user = JSON.parse(localStorage.getItem("user"));

  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState(user?.address || "");
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || "");
  const [loading, setLoading] = useState(true);

  // ===============================
  // Fetch cart
  // ===============================
  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/cart/${userId}`);
      setCartItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  // ===============================
  // Update quantity
  // ===============================
  const updateQuantity = async (cartId, quantity) => {
    if (quantity < 1) return;

    try {
      await axios.put(`http://localhost:5000/cart/${cartId}`, { quantity });

      setCartItems(
        cartItems.map((item) =>
          item.cart_id === cartId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // ===============================
  // Remove item
  // ===============================
  const removeFromCart = async (cartId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${cartId}`);
      setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // ===============================
  // Submit order
  // ===============================
  const submitOrder = async () => {
    try {
      const res = await axios.post("http://localhost:5000/order", {
        user_id: userId,
        address,
        mobileNumber,
      });

      alert(res.data.message);
      setCartItems([]);
    } catch (err) {
      console.error("Order error:", err);
      alert("Failed to submit order");
    }
  };

  // ===============================
  // UI states
  // ===============================
  if (loading) return <p>Loading cart...</p>;
  if (cartItems.length === 0) return <p>Your cart is empty</p>;

  return (
    <div className="cartContainer">
      <h2>Your Cart</h2>

      {cartItems.map((item) => (
        <div className="cartItem" key={item.cart_id}>
          <img
            src={`http://localhost:5000/images/${item.image}`}
            alt={item.name}
          />

          <div className="cartInfo">
            <h3>{item.name}</h3>
            <p>${item.price}</p>

            <p>
              Quantity:
              <button
                onClick={() =>
                  updateQuantity(item.cart_id, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
              >
                -
              </button>

              {item.quantity}

              <button
                onClick={() =>
                  updateQuantity(item.cart_id, item.quantity + 1)
                }
              >
                +
              </button>
            </p>

            <button onClick={() => removeFromCart(item.cart_id)}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <h3>
        Total: $
        {cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )}
      </h3>

      {/* ===============================
          Delivery Information
      =============================== */}
      <div className="orderForm">
        <h3>Delivery Information</h3>

        <p>
          <strong>Name:</strong> {user?.username}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />

        <button className="submitOrderBtn" onClick={submitOrder}>
          Submit Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
