function Footer({ contactInfo, copyrightYear }) {
  const { email, location, github, linkedin } = contactInfo;

  return (
    <footer className="portfolio-footer" id="contact">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-title">Get In Touch</h3>
            <p className="footer-text">
              Interested in collaborating or discussing web development opportunities? Feel free to reach out.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Contact Details</h4>
            <ul className="footer-contact-list">
              <li>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <strong>Location:</strong> {location}
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Profiles</h4>
            <ul className="footer-links-list">
              <li>
                <a href={github} target="_blank" rel="noopener noreferrer">
                  GitHub Profile
                </a>
              </li>
              <li>
                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn Profile
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {copyrightYear} CHARUSAT Student Portfolio (ITUE301 &bull; Practical 1). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
