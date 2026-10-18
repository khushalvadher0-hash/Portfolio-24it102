import Projects from '../components/Projects';

function ProjectsPage() {
  return (
    <div className="projects-page">
      <div className="page-header-banner">
        <div className="section-container">
          <span className="page-badge">Practical 3 &bull; REST API Integration</span>
          <h1 className="page-main-title">My Projects</h1>
          <p className="page-main-subtitle">
            Explore live repositories fetched dynamically from the GitHub REST API using React hooks and real-time search.
          </p>
        </div>
      </div>

      {/* Renders the reusable Projects component with dynamic GitHub API data */}
      <Projects />
    </div>
  );
}

export default ProjectsPage;
