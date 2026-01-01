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
    axios
      .get("https://webv2-lx9o.onrender.com/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));

    axios
      .get("https://webv2-lx9o.onrender.com/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="home">
      <h1>Welcome to D&L Women Store!</h1>
      <Text />

    
      <h2>Shop by Category</h2>
      <div className="categoryGrid">
        {categories.map((cat) => (
          <Link to={`/categories/${cat.id}`} key={cat.id}>
            <div className="categoryItem">
              <img
                src={`https://webv2-lx9o.onrender.com/images/${cat.image}`}
                alt={cat.name}
              />
              <h3>{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>

 
      <h2>Our Collection</h2>
      <div className="productsGrid">
        {products.map((product) => (
          <Product
            key={product.product_id}   // ✅ FIXED
            product={product}          // ✅ FULL OBJECT
            addToCart={addToCart}      // ✅ PASSED CORRECTLY
          />
        ))}
      </div>

      <NewsLetter />
    </div>
  );
};

export default Home;
