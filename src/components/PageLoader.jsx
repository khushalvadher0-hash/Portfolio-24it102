import './PageLoader.css';

function PageLoader({ message = 'Loading page...' }) {
  return (
    <div className="page-loader-container" role="status" aria-live="polite">
      <div className="page-loader-spinner" aria-hidden="true"></div>
      <p className="page-loader-message">{message}</p>
    </div>
  );
}

export default PageLoader;
