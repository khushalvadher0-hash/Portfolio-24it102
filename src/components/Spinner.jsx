function Spinner({ message = 'Loading repositories...' }) {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner-circle"></div>
      <p className="spinner-message">{message}</p>
    </div>
  );
}

export default Spinner;
