import React from "react";
import { useNavigate } from "react-router-dom";
import "./Banners.css";

const Banners = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/collections");
  };

  return (
    <div className="banner-section">
      <div className="banner-large" onClick={handleNavigation}>
        <img src="/Banner1.png" alt="Large Banner" />
      </div>
      <div className="banner-small" onClick={handleNavigation}>
        <img src="/Banner2.png" alt="Small Banner 1" />
      </div>
      <div className="banner-small" onClick={handleNavigation}>
        <img src="/Banner3.png" alt="Small Banner 2" />
      </div>
    </div>
  );
};

export default Banners;
