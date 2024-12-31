import React, { useContext, useState } from "react";
import { IoIosClose } from "react-icons/io"; // Import the close icon
import "./LoginPopUp.css";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";

const LoginPopUp = ({ setShowLogin }) => {
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { url, token, setToken } = useContext(ShopContext);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
  
    const endpoint =
      currentState === "Login" ? `${url}/api/users/login` : `${url}/api/users/register`;
  
    try {
      const response = await axios.post(endpoint, data);
      if (response.data.success) {
        // Log the received token before setting it
        console.log("Received Token:", response.data.token);
        
        setToken(response.data.token);
        
        // Verify localStorage storage
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("token", response.data.token);
          console.log("Token stored in localStorage:", localStorage.getItem("token"));
        }
        
        setShowLogin(false); // Close popup after successful login
      } else {
        console.log("Login/Register was not successful:", response.data);
      }
    } catch (error) {
      console.error("Login/Register failed:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-popup">
      <form
        onSubmit={onLogin}
        className={`login-pop-container ${
          currentState === "Login" ? "login-bg" : "signup-bg"
        }`}
      >
        <div className="login-pop-title">
          <h2>{currentState}</h2>
          <IoIosClose
            onClick={() => setShowLogin(false)}
            style={{ cursor: "pointer", fontSize: "30px" }}
            aria-label="Close login popup"
            role="button"
          />
        </div>
        <div className="login-pop-inputs">
          {currentState === "Sign Up" && (
            <input
              name="username"
              onChange={onChangeHandler}
              value={data.username}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <div className="password-field">
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="password-toggle"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : currentState === "Sign Up" ? "Create account" : "Login"}
        </button>
        {currentState === "Sign Up" && (
          <div className="login-pop-condition">
            <input type="checkbox" required />
            <p>By Continuing, I agree with the terms of use & privacy policy.</p>
          </div>
        )}
        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;