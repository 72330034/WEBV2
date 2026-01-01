import "../styles/Home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import NewsLetter from "../components/NewsLetter";
import Text from "../components/Text";
import Product from "../components/Product";
import { Link } from "react-router-dom";

const Home = ({ addToCart }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/categories")
      .then(res => setCategories(res.data));

    axios.get("http://localhost:5000/products")
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div className="home">
      <h1>Welcome to D&L Women Store!</h1>
      <Text />

      {/* ===== Categories Section ===== */}
      <h2>Shop by Category</h2>
      <div className="categoryGrid">
        {categories.map(cat => (
          <Link to={`/categories/${cat.id}`} key={cat.id}>
            <div className="categoryItem">
              <img
                src={`http://localhost:5000/images/${cat.image}`}
                alt={cat.name}
              />
              <h3>{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* ===== Products Section ===== */}
      <h2>Our Collection</h2>
      <div className="productsGrid">
        {products.map(product => (
          <Product
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>

      <NewsLetter />
    </div>
  );
};

export default Home;
