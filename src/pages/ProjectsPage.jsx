import TaskManager from '../components/TaskManager';

function ProjectsPage() {
  return (
    <div className="projects-page">
      <div className="page-header-banner">
        <div className="section-container">
          <span className="page-badge">Practical 6 &bull; Full-Stack MERN Integration</span>
          <h1 className="page-main-title">Task Manager</h1>
          <p className="page-main-subtitle">
            Manage real-time tasks persisted in MongoDB via our Node.js & Express REST API with full CRUD operations.
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
