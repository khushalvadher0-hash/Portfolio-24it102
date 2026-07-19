import React, { useState } from 'react'; // Imported useState hook
import Footer from '../components/Footer';

// This is the Contact page component.
// It demonstrates state management using the useState hook.
function Contact() {
  // State to hold the message typed by the student
  const [message, setMessage] = useState("");
  
  // State to show/hide the help message
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="page-container contact-page">
      <h2 className="page-heading">Contact Me</h2>
      
      <div className="contact-card">
        {/* Controlled Input Box */}
        <label htmlFor="message-input">Enter Message:</label>
        <input 
          id="message-input"
          type="text" 
          placeholder="Type something here..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          className="contact-input"
        />

        {/* Display what the student typed */}
        <p className="typed-output">
          <strong>You typed:</strong> {message}
        </p>

        {/* Character Count display */}
        <p className="char-count">
          <strong>Character Count:</strong> {message.length}
        </p>

        {/* Help button that toggles help state */}
        <button 
          onClick={() => setShowHelp(!showHelp)} 
          className="help-btn"
        >
          {showHelp ? "Hide Help" : "Show Help"}
        </button>

        {/* Conditionally display help message if showHelp is true */}
        {showHelp && (
          <p className="help-text">
            Please enter your message above.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Contact;
