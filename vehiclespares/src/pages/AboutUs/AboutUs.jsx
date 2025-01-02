import React, { useState, useEffect } from 'react';
import './AboutUs.css';

const images = [
  "/dashboard.jpg",
  "/engine.jpeg",
  "mazda.jpg"
];

const AboutUS = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000); // Change image every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="about-us-container">
      <div className="hero-slider">
        <img 
          src={images[currentImageIndex]} 
          alt={`Slide ${currentImageIndex + 1}`} 
          className="slider-image" 
        />
      </div>

      <div className="about-us-header">
        <h1>Welcome to TopMaz AutoSpares!</h1>
        <p>Your trusted partner for quality car spare parts and expert mechanics.</p>
      </div>

      <div className="about-us-content">
        <div className="about-us-description">
          <h2>Who We Are</h2>
          <p>
            Since our journey began in 2022, we’ve been on a mission to redefine how car spare parts are bought and serviced.
            At TopMaz AutoSpares, we don’t just sell spare parts; we provide solutions that keep your vehicle running smoothly and reliably.
          </p>
          <p>
            Our <span className="highlight">e-commerce platform</span> makes it easy to shop for spare parts, whether you’re at home, in the office, or on the go. Simply browse our extensive inventory, place your order, and have it delivered right to your doorstep.
          </p>
        </div>

        <div className="about-us-values">
          <h2>What Sets Us Apart</h2>
          <ul>
            <li>🛠️ <strong>Wide Selection:</strong> High-quality spare parts for all vehicle makes and models.</li>
            <li>⚙️ <strong>Expert Mechanics:</strong> On-site professionals to handle all your vehicle needs.</li>
            <li>🚗 <strong>Unmatched Convenience:</strong> Shop online or visit our store for a seamless experience.</li>
          </ul>
        </div>
      </div>

      <div className="about-us-footer">
        <p>
          Thank you for choosing TopMaz AutoSpares—your one-stop shop for all things automotive. We’re here to keep your vehicle road-ready!
        </p>
      </div>
    </section>
  );
};

export default AboutUS;
