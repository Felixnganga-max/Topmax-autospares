import React, { useState } from "react";
import './Navbar.css';
import { Link } from "react-router-dom";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import { MdAddCall } from "react-icons/md";
import { SiMediafire, SiMercedes } from "react-icons/si";
import { CiMenuFries } from "react-icons/ci";




const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navigation">
      {/* LOGO */}
      <div className="left">
      <img className="top-logo" src="/auto-2.jpg" />
      </div>

      {/* MENU ITEMS */}
      <div className={`center ${menuOpen ? "show" : ""}`}>
        <Link to="/" className="item home" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/collections" className="item collections" onClick={() => setMenuOpen(false)}>Collections</Link>
        <Link to="/brands" className="item brands" onClick={() => setMenuOpen(false)}>Brands</Link>
        <Link to="/about-us" className="item about-us" onClick={() => setMenuOpen(false)}>About Us</Link>
        <Link to="/contact" className="item contact" onClick={() => setMenuOpen(false)}>Contact</Link>
      </div>

      {/* CALL OUR EXPERT */}
      <div className="right">
        <h2>Call Us</h2>
        <MdAddCall />
      </div>

      {/* TOGGLE BUTTONS */}
      <div className="menus">
        {!menuOpen ? (
          <HiOutlineMenuAlt1 onClick={toggleMenu} height={150} width={100}/>
          
        ) : (
          <IoIosClose onClick={toggleMenu}/>
        )}
      </div>
    </div>
  );
};

export default Navbar;
