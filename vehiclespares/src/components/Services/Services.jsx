import React from "react";
import "./Services.css";

const Services = () => {
  const handleRightClick = (e) => {
    e.preventDefault();  // Disable right-click
  };

  return (
    <div className="services-container">
      <h1 className="services-title">Experience Excellence: A Glimpse of Our Services</h1>
      <div className="services-content">
        {/* Large Video on the Left */}
        <div className="large-video" onContextMenu={handleRightClick}>
          <video autoPlay loop muted>
            <source src="Banner1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button className="contact-btn">Contact Us</button>
        </div>

        {/* Two Smaller Videos on the Right */}
        <div className="small-videos">
          <div className="small-video" onContextMenu={handleRightClick}>
            <video autoPlay loop muted>
              <source src="Banner2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
