import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">404 – Page Not Found</h1>
        <p className="notfound-desc">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
