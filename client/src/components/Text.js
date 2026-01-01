import "../styles/Text.css";
import { Link } from "react-router-dom";
const Text=()=> {
  return (
    <div className="text">
      <div className="text-text">
        <h1>New Season, New Style</h1>
        <p>Discover the latest trends for confident, stylish women.</p>
       <Link to="/category"><button className="shop-btn">Shop Now</button></Link> 
      </div>
    </div>
  );
}
export default Text;