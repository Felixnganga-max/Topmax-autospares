import React from "react";
import "./Footer.css"; // Make sure to create this CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Company Info */}
        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press Releases</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        {/* Column 2: Spare Parts Categories */}
        <div className="footer-column">
          <h4>Spare Parts</h4>
          <ul>
            <li>Engines</li>
            <li>Brakes & Suspension</li>
            <li>Lights & Electrical</li>
            <li>Filters</li>
            <li>Transmission</li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="footer-column">
          <h4>Contact</h4>
          <ul>
            <li>Email: support@spareparts.com</li>
            <li>Phone: +1 (800) 123-4567</li>
            <li>Address: 123 Auto Parts St, Vehicle City, USA</li>
            <li>Follow Us:</li>
            <li>
              <a href="#">Facebook</a> | <a href="#">Instagram</a> |{" "}
              <a href="#">Twitter</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
