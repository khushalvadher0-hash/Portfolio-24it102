import React from 'react';
import { Link } from 'react-router-dom';

// This is the NotFound page component. It is shown when the URL does not match any route.
function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-code">404</h1>
      <h2 className="notfound-message">Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      
      {/* Return Home button using Link component */}
      <Link to="/" className="home-btn">Go Back Home</Link>
    </div>
  );
}

export default NotFound;
