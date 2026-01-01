import React, { useState } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import "../styles/Contact.css";
import Logo11 from "../assets/Logo11.jpeg";

const ContactUS = () => {
  const navigate = useNavigate();

  const [contact, setContact] = useState({
    name: "",
    email: "",
    feedback: "",
    
  });

  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setContact((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/contact", contact);
      navigate("/contact");
      alert("Your message has been sent!");
    } catch (err) {
      console.log(err);
      setError(true);
      alert("Your message could not be sent!");
    }
  };

  return (
    <div className="contact">
      <div
        className="leftSide"
        style={{ backgroundImage: `url(${Logo11})` }}
      ></div>
      <div className="rightSide">
        <h1> Contact Us</h1>

      <form>

        <div className="field">
        <input
          type="text"
          placeholder="Full Name"
          name="name"
          onChange={handleChange}
        /></div>

        <br /><br />
         <div className="field">
        <input
          type="text"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        /></div>

        <br /><br />  
        
        <div className="field">
        <input
          type="text"
          placeholder="Enter your Feedback..."
          name="feedback"
          onChange={handleChange}
        /></div>
</form>
        <br /><br />
        
       <button type="submit" onClick = {handleClick}> Submit</button>

        {error && <p style={{ color: "red" }}>Something went wrong!</p>}
      
    </div>
    </div>
    
  );
}

export default ContactUS;