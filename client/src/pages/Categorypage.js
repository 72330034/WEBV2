import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Product from "../components/Product";
import "../styles/CategoryProducts.css";

const CategoryProducts = ({ addToCart }) => {
  const { id } = useParams(); // category id
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/category/${id}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div className="categoryProducts">
      <h1>Products</h1>

      <div className="productsGrid">
        {products.length > 0 ? (
          products.map((product) => (
            <Product
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
