import React from 'react';

// This is the Header component.
// It receives 'name' and 'themeColor' as props from its parent component (App.jsx).
function Header(props) {
  return (
    <header className="header-container">
      {/* We apply the themeColor prop directly as an inline style for the color */}
      <h1 style={{ color: props.themeColor }}>Student Portfolio</h1>
      <h2>Welcome to {props.name}'s Portfolio</h2>
    </header>
  );
}

export default Header;
