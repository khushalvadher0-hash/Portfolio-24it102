function Header({ name, title, themeColor }) {
  // themeColor prop applied as an inline style
  const headerStyle = {
    backgroundColor: themeColor || '#1e40af',
  };

  return (
    <header className="portfolio-header" style={headerStyle} id="home">
      <div className="header-container">
        <p className="header-badge">ITUE301 &bull; Practical 1 Portfolio</p>
        <h1 className="header-title">{name}</h1>
        <p className="header-subtitle">{title}</p>
        <div className="header-actions">
          <a href="#projects" className="btn btn-light">View Projects</a>
          <a href="#contact" className="btn btn-outline-light">Get in Touch</a>
        </div>
      </div>
    </header>
  );
}

export default Header;
