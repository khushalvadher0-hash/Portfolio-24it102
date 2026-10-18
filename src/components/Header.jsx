import { Link } from 'react-router-dom';

function Header({ name, title, themeColor }) {
  // themeColor prop applied as an inline style
  const headerStyle = {
    backgroundColor: themeColor || '#1e40af',
  };

  return (
    <header className="portfolio-header" style={headerStyle} id="home">
      <div className="header-container">
        <p className="header-badge">ITUE301 &bull; Practical 2 Portfolio</p>
        <h1 className="header-title">{name}</h1>
        <p className="header-subtitle">{title}</p>
        <div className="header-actions">
          <Link to="/projects" className="btn btn-light">View Projects</Link>
          <Link to="/contact" className="btn btn-outline-light">Get in Touch</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
