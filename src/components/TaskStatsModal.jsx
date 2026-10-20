import './TaskStatsModal.css';

function TaskStatsModal({ tasks = [], onClose }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const highPriority = tasks.filter((t) => t.priority === 'high').length;
  const mediumPriority = tasks.filter((t) => t.priority === 'medium').length;
  const lowPriority = tasks.filter((t) => t.priority === 'low').length;

  return (
    <div className="stats-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="stats-modal-title">
      <div className="stats-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="stats-modal-header">
          <div>
            <span className="stats-modal-badge">Practical 8 • Lazy Component</span>
            <h3 id="stats-modal-title" className="stats-modal-title">Task Analytics & Metrics</h3>
          </div>
          <button type="button" className="stats-modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <p className="stats-modal-desc">
          Dynamically loaded on demand using React.lazy() and Suspense to prevent bloating the initial bundle.
        </p>

        <div className="stats-metrics-grid">
          <div className="metric-box total">
            <span className="metric-val">{total}</span>
            <span className="metric-lbl">Total Tasks</span>
          </div>
          <div className="metric-box done">
            <span className="metric-val">{completed}</span>
            <span className="metric-lbl">Completed</span>
          </div>
          <div className="metric-box pending">
            <span className="metric-val">{pending}</span>
            <span className="metric-lbl">Pending</span>
          </div>
          <div className="metric-box rate">
            <span className="metric-val">{completionRate}%</span>
            <span className="metric-lbl">Completion Rate</span>
          </div>
        </div>

        <div className="stats-priority-breakdown">
          <h4 className="priority-breakdown-title">Priority Distribution</h4>
          <div className="priority-bars">
            <div className="priority-row">
              <span className="priority-name high">High</span>
              <div className="priority-bar-track">
                <div
                  className="priority-bar-fill high-fill"
                  style={{ width: `${total ? (highPriority / total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="priority-count">{highPriority}</span>
            </div>
            <div className="priority-row">
              <span className="priority-name medium">Medium</span>
              <div className="priority-bar-track">
                <div
                  className="priority-bar-fill medium-fill"
                  style={{ width: `${total ? (mediumPriority / total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="priority-count">{mediumPriority}</span>
            </div>
            <div className="priority-row">
              <span className="priority-name low">Low</span>
              <div className="priority-bar-track">
                <div
                  className="priority-bar-fill low-fill"
                  style={{ width: `${total ? (lowPriority / total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="priority-count">{lowPriority}</span>
            </div>
          </div>
        </div>

        <div className="stats-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskStatsModal;
