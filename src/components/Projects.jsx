import React from 'react';

// This is the Projects component.
// It shows three simple project cards with titles and short descriptions.
function Projects() {
  return (
    <section className="projects-section">
      <h3>My Projects</h3>
      <div className="projects-grid">
        
        {/* Project Card 1 */}
        <div className="project-card">
          <h4>Touch Of Joy Beauty Salon</h4>
          <p>A beauty salon management website</p>
        </div>

        {/* Project Card 2 */}
        <div className="project-card">
          <h4>Mukesh Graphics</h4>
          <p>A portfolio for a graphic design service</p>
        </div>

        {/* Project Card 3 */}
        <div className="project-card">
          <h4>RTO Webapp</h4>
          <p>An online portal for RTO services and applications</p>
        </div>

      </div>
    </section>
  );
}

export default Projects;
