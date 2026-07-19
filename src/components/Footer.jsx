import React from 'react';

// This is the Footer component.
// It displays contact email information and the copyright text.
function Footer() {
  return (
    <footer className="footer-container">
      <p>Contact Email: khushal.vadher@example.com</p>
      <p>&copy; {new Date().getFullYear()} Student Portfolio. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
