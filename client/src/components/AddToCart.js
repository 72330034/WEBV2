import axios from "axios";

const addToCart = async (product) => {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    alert("Please login first");
    return;
  }

  try {
    await axios.post("https://webv2-lx9o.onrender.com/cart", {
      user_id: Number(userId),
      product_id: product.id, // ✅ FIXED
      quantity: 1,
    });

    alert("Product added to cart 🛒");
  } catch (err) {
    console.error(err);
    alert("Failed to add product to cart");
  }
};

export default addToCart;
