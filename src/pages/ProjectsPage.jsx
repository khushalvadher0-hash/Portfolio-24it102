import TaskManager from '../components/TaskManager';

function ProjectsPage() {
  return (
    <div className="projects-page">
      <div className="page-header-banner">
        <div className="section-container">
          <span className="page-badge">Practical 7 &bull; JWT Authentication & Pipeline</span>
          <h1 className="page-main-title">Task Manager</h1>
          <p className="page-main-subtitle">
            Secure task management protected by JWT authentication middleware and user-scoped data persistence in MongoDB.
          </p>
        </div>
      </div>

      {/* Renders the full-stack MongoDB Task Manager */}
      <div className="section-container" style={{ marginTop: '2rem' }}>
        <TaskManager />
      </div>
    </div>
  );
}

export default ProjectsPage;
