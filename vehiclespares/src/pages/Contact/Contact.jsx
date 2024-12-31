import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import "./Contact.css";
import { images } from "../../assets/assets";

const Contact = () => {
  return (
    <section className="contact-us-container">
      {/* Hero Section */}
      <div className="contact-hero">
        <img
          src={images.contact}
          alt="Contact Us Hero"
          className="hero-image"
        />
        <h1 className="hero-title">Get in Touch with Us</h1>

        {/* Social Media Icons */}
        <div className="social-media-icons">
          <div className="icon-container">
            <FaFacebookF />
          </div>
          <div className="icon-container">
            <FaTwitter />
          </div>
          <div className="icon-container">
            <FaInstagram />
          </div>
          <div className="icon-container">
            <IoMdCall />
          </div>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="contact-details">
        <h2>Contact Details</h2>
        <p>Email: <span className="highlight">info@topmazautospares.com</span></p>
        <p>Phone: <span className="highlight">+254 700 123 456</span></p>
        <p>Address: <span className="highlight">123 AutoSpares Lane, Nairobi</span></p>
      </div>
    </section>
  );
};

export default Contact;