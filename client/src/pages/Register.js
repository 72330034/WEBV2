import React, { useState } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    mobileNumber: "",
    address: "",
    
  });

  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/addUser", user);
      navigate("/");
      alert("Registration successful!");
    } catch (err) {
      console.log(err);
      setError(true);
      alert("Registration failed!");
    }
  };

  return (
    <div className="register">
     <div className="register-page">
      <div className="register-card">
        <h2>Welcome</h2>
        <p className="subtitle">Register to continue</p>
    
      <form>
        <div className="field">
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={handleChange}
        /></div>
         <div className="field">
        <input
          type="text"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        /></div>
         <div className="field">
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        /></div>
       <div className="field">
        <input
          type="text"
          placeholder="Phone Number"
          name="mobileNumber"
          onChange={handleChange}
        /></div>
        <div className="field">
        <input
          type="text"
          placeholder="Address"
          name="address"
          onChange={handleChange}
        /></div>
</form>
        
        <button className="register-btn" onClick={handleClick}>Register</button>

        {error && <p style={{ color: "red" }}>Something went wrong!</p>}
      
    </div>
    </div>
    </div>
  );
}

export default Register;