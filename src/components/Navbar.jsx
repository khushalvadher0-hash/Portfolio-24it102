import React from 'react';
import { Link } from 'react-router-dom'; // Import Link to navigate without reloading

// This is the Navbar component. It helps navigate between pages using Links.
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Student Portfolio</div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/projects" className="nav-link">Projects</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>
    </nav>
  );
}

export default Navbar;
