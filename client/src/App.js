import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer"
import Home from "./pages/Home";
import About from "./pages/About";
import ContactUS from "./pages/ContactUS";
import Category from "./pages/Category";
import Categorypage from "./pages/Categorypage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";

const App = () => {
  const addToCart = async (product) => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("Please login first to add items to cart");
      window.location.href = "/login";
      return;
    }

    try {
      await axios.post("http://localhost:5000/cart", {
        user_id: Number(userId),
        product_id: product.product_id, // ✅ important
        quantity: 1,
      });

      alert("Product added to cart");
    } catch (error) {
      console.log(error);
      alert("Failed to add product to cart");
    }
  };

  const ProtectedRoute = ({ children }) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <div className="App">
      <Router>
        <NavBar />

        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/home" element={<Home addToCart={addToCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUS />} />
          <Route path="/category" element={<Category />} />
          <Route path="/categories/:id" element={<Categorypage addToCart={addToCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </Router>
    </div>
  );
};

export default App;
