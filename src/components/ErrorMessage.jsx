function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-card" role="alert">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3 className="error-title">Unable to Load Repositories</h3>
        <p className="error-detail">
          {message || 'An unexpected error occurred while fetching repository data.'}
        </p>
        <p className="error-hint">
          This could be caused by a temporary network disconnection, GitHub API rate limits (60 requests/hour for unauthenticated users), an invalid username, or remote server downtime.
        </p>
        {onRetry && (
          <button type="button" className="btn btn-retry" onClick={onRetry}>
            🔄 Retry Request
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
