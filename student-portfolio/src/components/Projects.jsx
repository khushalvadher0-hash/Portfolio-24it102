function Projects({ projectList }) {
  return (
    <section className="portfolio-section" id="projects">
      <div className="section-container">
        <h2 className="section-title">Academic Projects</h2>
        <div className="section-divider"></div>
        <p className="section-subtitle">
          Selected works showcasing problem solving and front-end development skills:
        </p>

        <div className="projects-grid">
          {projectList.map((project) => (
            <article key={project.id} className="project-card">
              <div className="project-card-header">
                <span className="project-badge">Project #{project.id}</span>
                <h3 className="project-title">{project.title}</h3>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-tech-tags">
                {project.technologies.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
