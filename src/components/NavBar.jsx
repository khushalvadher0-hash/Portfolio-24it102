import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

function NavBar({ isDarkMode, onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="portfolio-nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
          DevPortfolio<span className="brand-dot">.</span>
        </Link>

        <div className="nav-right-cluster">
          {/* Theme Toggle Button (Light / Dark Mode) */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* Mobile hamburger toggle */}
          <button
            className="nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>

        {/* Navigation links using NavLink with end prop for exact home match */}
        <ul className={`nav-links ${mobileMenuOpen ? 'nav-links-open' : ''}`}>
          <li className="nav-item">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMobileMenu}
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMobileMenu}
            >
              Projects
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMobileMenu}
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
