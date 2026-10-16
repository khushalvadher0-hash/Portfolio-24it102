function Skills({ skillList }) {
  return (
    <section className="portfolio-section bg-alt" id="skills">
      <div className="section-container">
        <h2 className="section-title">Technical Skills</h2>
        <div className="section-divider"></div>
        <p className="section-subtitle">
          Key technologies, tools, and frameworks I work with:
        </p>
        <ul className="skills-list">
          {skillList.map((skill) => (
            <li key={skill} className="skill-item">
              <span className="skill-icon">✓</span>
              <span className="skill-name">{skill}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Skills;
