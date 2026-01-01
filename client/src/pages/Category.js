import "../styles/Category.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/categories");
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="category">
      <h1 className="categoryTitle">Our Category</h1>

      <div className="categoryList">
        {categories.map((cat) => (
          <Link to={`/categories/${cat.id}`} key={cat.id}>
            <div className="categoryItem">
              <div className="categoryImage">
                <img
                  src={`http://localhost:5000/images/${cat.image}`}
                  alt={cat.name}
                />
              </div>

              <div className="categoryName">
                <h3>{cat.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
