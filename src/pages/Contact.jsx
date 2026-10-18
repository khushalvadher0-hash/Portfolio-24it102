import { useState } from 'react';

function Contact() {
  // Required state variables for controlled form and UI management
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Maximum character limit for message
  const maxChars = 500;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation check
    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }

    // Set submitted status
    setSubmitted(true);
  };

  // Reset form or clear submitted state when user modifies inputs
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (submitted) setSubmitted(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (submitted) setSubmitted(false);
  };

  const handleMessageChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setMessage(text);
    }
    if (submitted) setSubmitted(false);
  };

  return (
    <div className="contact-page">
      <div className="page-header-banner">
        <div className="section-container">
          <span className="page-badge">Practical 2 &bull; State Management</span>
          <h1 className="page-main-title">Contact Me</h1>
          <p className="page-main-subtitle">
            Demonstrating controlled inputs, live character counting, and state toggles using React's useState.
          </p>
        </div>
      </div>

      <section className="portfolio-section">
        <div className="section-container form-container">
          {/* Help toggle button and conditional guidance box */}
          <div className="help-section">
            <button
              type="button"
              className="btn btn-help-toggle"
              onClick={() => setShowHelp(!showHelp)}
            >
              {showHelp ? 'Hide Form Help' : 'Show Form Help'}
            </button>

            {showHelp && (
              <div className="help-card">
                <h4>Guidance for Completing this Form:</h4>
                <ul>
                  <li>Provide your full name so I know who reached out.</li>
                  <li>Use a valid email format (e.g., student@charusat.edu.in) so I can respond.</li>
                  <li>Type your feedback or project query in the message box.</li>
                  <li>Notice the character counter updating in real time as you type!</li>
                </ul>
              </div>
            )}
          </div>

          {/* Success Message Banner upon valid submission */}
          {submitted && (
            <div className="success-banner" role="alert">
              <span className="success-icon">✓</span>
              <div>
                <strong>Thank you, {name}!</strong>
                <p>Your message has been captured successfully in the React component state.</p>
              </div>
            </div>
          )}

          {/* Controlled Contact Form */}
          <form className="contact-form-card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contact-name" className="form-label">
                Your Name <span className="required-star">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email" className="form-label">
                Email Address <span className="required-star">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                className="form-input"
                placeholder="e.g. yourname@example.com"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>

            <div className="form-group">
              <div className="label-counter-row">
                <label htmlFor="contact-message" className="form-label">
                  Your Message <span className="required-star">*</span>
                </label>
                {/* Real-time character counter derived directly from message.length */}
                <span
                  className={`char-counter ${
                    message.length >= maxChars ? 'char-counter-limit' : ''
                  }`}
                >
                  Characters: {message.length} / {maxChars}
                </span>
              </div>
              <textarea
                id="contact-message"
                className="form-textarea"
                rows="5"
                placeholder="Write your message or inquiry here..."
                value={message}
                onChange={handleMessageChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-submit">
              Submit Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Contact;
