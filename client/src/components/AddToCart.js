import axios from "axios";

const addToCart = async (productId, size, quantity) => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Please login first");
    return;
  }

  try {
    await axios.post("http://localhost:5000/cart", {
      user_id: userId,
      product_id: productId,
      size,
      quantity,
    });

    alert("Product added to cart 🛒");
  } catch (err) {
    console.log(err);
  }
};

export default addToCart;