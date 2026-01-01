import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/login", user);

      if (res.data.success) {
        alert(res.data.message);

        // ✅ Save login
        localStorage.setItem("user_id", String(res.data.user.id));
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/home");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="login">
      <div className="login-page">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to continue</p>

          <form>
            <div className="field">
              <input type="email" placeholder="Email" name="email" onChange={handleChange} required />
            </div>

            <br />

            <div className="field">
              <input type="password" placeholder="Password" name="password" onChange={handleChange} required />
            </div>

            <br />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button className="login-btn" type="submit" onClick={handleClick}>
              Login
            </button>
          </form>

          <br />

          <div className="extra">
            <Link to="#">Forgot Password?</Link>
            <p>
              Don’t have an account? <Link to="/register"> Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
