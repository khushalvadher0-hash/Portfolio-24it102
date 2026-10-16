function About({ studentDetails }) {
  const { education, college, university, branch, rollNo, careerGoal } = studentDetails;

  return (
    <section className="portfolio-section" id="about">
      <div className="section-container">
        <h2 className="section-title">About Me</h2>
        <div className="section-divider"></div>

        <div className="about-content">
          <div className="about-text">
            <p className="about-intro">
              Hello! I am a passionate Information Technology undergraduate student at{' '}
              <strong>{college}</strong>, <strong>{university}</strong>. I love solving algorithmic
              challenges and creating responsive, accessible user interfaces using modern web technologies.
            </p>
            <p>
              I am currently studying <em>Advanced Web Development Frameworks (ITUE301)</em>, focusing on
              component-driven architectures, unidirectional data flow, and modern JavaScript standards.
            </p>
            <p>
              <strong>Career Goal:</strong> {careerGoal}
            </p>
          </div>

          <div className="about-card">
            <h3>Academic Information</h3>
            <ul className="about-info-list">
              <li>
                <span className="info-label">Degree:</span>
                <span className="info-value">{education}</span>
              </li>
              <li>
                <span className="info-label">Branch:</span>
                <span className="info-value">{branch}</span>
              </li>
              <li>
                <span className="info-label">Roll Number:</span>
                <span className="info-value">{rollNo}</span>
              </li>
              <li>
                <span className="info-label">University:</span>
                <span className="info-value">{university}</span>
              </li>
              <li>
                <span className="info-label">Status:</span>
                <span className="info-value status-badge">Active Student</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
