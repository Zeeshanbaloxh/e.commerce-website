import React, { useState } from 'react';
import './CSS/LoginSignUp.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [isAgreed, setIsAgreed] = useState(false); 

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login Function Executed", formData);
    // You can add the login API call here if needed.
    let responseData;
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',  // Fixed content type
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Ensure the response is in JSON format
      responseData = await response.json();

      if (responseData.success) {
        // Store the token and navigate to the home page
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/"); // Navigate to home page
      } else {
        alert('Login failed, please try again.');
      }
    } catch (error) {
      console.error("Login error: ", error);
      alert('An error occurred. Please try again later.');
    }
  


  };

  const signup = async () => {
    console.log("Sign Up Function Executed", formData);



    // Check if user has agreed to terms and conditions before proceeding
    if (!isAgreed) {
      alert('You must agree to the terms of use and privacy policy');
      return;
    }

    let responseData;
    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',  // Fixed content type
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Ensure the response is in JSON format
      responseData = await response.json();

      if (responseData.success) {
        // Store the token and navigate to the home page
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/"); // Navigate to home page
      } else {
        alert('Signup failed, please try again.');
      }
    } catch (error) {
      console.error("Signup error: ", error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
        </div>

        {/* Fix the button onClick handler */}
        <button onClick={() => (state === "Login" ? login() : signup())}>Continue</button>

        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account{" "}
            <span onClick={() => setState("Login")}>Login Here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}

        {/* Terms agreement checkbox */}
        <div className="loginsignup-agree">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={() => setIsAgreed(!isAgreed)}
          />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
