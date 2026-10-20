import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import './TaskManager.css';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');

  // Operation In-Progress tracking for specific task IDs (to disable buttons)
  const [activeActionId, setActiveActionId] = useState(null);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load tasks on mount
  const fetchTaskList = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch tasks from server.');
      showToast(err.message || 'Error fetching tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskList();
  }, []);

  // Handle Create Task with Optimistic UI
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    const trimmedTitle = title.trim();
    const newTaskPayload = {
      title: trimmedTitle,
      description: description.trim(),
      priority
    };

    // Temporary optimistic task
    const tempId = 'temp-' + Date.now();
    const optimisticTask = {
      _id: tempId,
      ...newTaskPayload,
      completed: false,
      createdAt: new Date().toISOString(),
      isPending: true
    };

    // Pre-insert into state optimistically
    setTasks((prev) => [optimisticTask, ...prev]);
    setIsSubmitting(true);
    setTitle('');
    setDescription('');
    setPriority('medium');

    try {
      const savedTask = await createTask(newTaskPayload);
      // Replace optimistic task with confirmed server task
      setTasks((prev) =>
        prev.map((t) => (t._id === tempId ? savedTask : t))
      );
      showToast('Task created successfully!', 'success');
    } catch (err) {
      // Revert optimistic task on failure
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      showToast(err.message || 'Failed to create task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Completed Status
  const handleToggleComplete = async (task) => {
    setActiveActionId(task._id);
    const updatedStatus = !task.completed;

    try {
      const updated = await updateTask(task._id, { completed: updatedStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updated : t))
      );
      showToast(
        `Task marked as ${updatedStatus ? 'completed' : 'incomplete'}`,
        'success'
      );
    } catch (err) {
      showToast(err.message || 'Failed to update task status', 'error');
    } finally {
      setActiveActionId(null);
    }
  };

  // Start Editing
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'medium');
  };

  // Cancel Editing
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
    setEditPriority('medium');
  };

  // Save Edit
  const handleSaveEdit = async (taskId) => {
    if (!editTitle.trim()) {
      showToast('Title cannot be empty', 'error');
      return;
    }

    setActiveActionId(taskId);
    try {
      const updated = await updateTask(taskId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? updated : t))
      );
      cancelEditing();
      showToast('Task updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'error');
    } finally {
      setActiveActionId(null);
    }
  };

  // Delete Task with Confirmation
  const handleDeleteTask = async (taskId, taskTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this task?\n"${taskTitle}"`
    );
    if (!confirmed) return;

    setActiveActionId(taskId);
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      showToast('Task deleted successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setActiveActionId(null);
    }
  };

  const getPriorityBadgeClass = (p) => {
    switch (p) {
      case 'high':
        return 'priority-badge priority-high';
      case 'medium':
        return 'priority-badge priority-medium';
      case 'low':
        return 'priority-badge priority-low';
      default:
        return 'priority-badge';
    }
  };

  return (
    <div className="task-manager-container">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`} role="alert">
          <span className="toast-text">{toast.message}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Form: Add New Task */}
      <section className="task-form-card" aria-labelledby="form-heading">
        <h2 id="form-heading" className="task-form-title">
          Create New Task
        </h2>
        <form onSubmit={handleCreateTask} className="task-create-form">
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className="form-input"
              placeholder="e.g., Prepare viva questions for Practical 6"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="task-description"
              className="form-textarea"
              placeholder="Provide additional details or requirements..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="task-priority" className="form-label">
                Priority
              </label>
              <select
                id="task-priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="form-group half-width button-align">
              <button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving Task...' : '+ Add Task'}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Task List Header */}
      <div className="task-list-header">
        <div className="task-count-info">
          <h2 className="section-title">All Tasks ({tasks.length})</h2>
          <span className="database-indicator">Connected to MongoDB</span>
        </div>
        <button
          type="button"
          onClick={fetchTaskList}
          className="btn btn-secondary reload-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : '&#x21bb; Refresh Tasks'}
        </button>
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="task-error-box" role="alert">
          <p className="error-title">Database Connection Error</p>
          <p className="error-description">{errorMessage}</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchTaskList}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="task-loading-box">
          <div className="loading-spinner"></div>
          <p>Fetching tasks from MongoDB database...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !errorMessage && tasks.length === 0 && (
        <div className="task-empty-box">
          <div className="empty-icon">&#128221;</div>
          <h3>No tasks found</h3>
          <p>Your task list is empty. Add a new task using the form above to get started!</p>
        </div>
      )}

      {/* Tasks List */}
      {!isLoading && tasks.length > 0 && (
        <div className="tasks-grid">
          {tasks.map((task) => {
            const isEditing = editingTaskId === task._id;
            const isActionActive = activeActionId === task._id;

            return (
              <div
                key={task._id}
                className={`task-card ${task.completed ? 'task-card-completed' : ''} ${
                  task.isPending ? 'task-card-pending' : ''
                }`}
              >
                {/* Pending Badge for Optimistic Add */}
                {task.isPending && (
                  <div className="pending-badge">Saving to database...</div>
                )}

                {isEditing ? (
                  /* Edit Mode Form */
                  <div className="task-edit-mode">
                    <input
                      type="text"
                      className="form-input edit-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Task title"
                      disabled={isActionActive}
                    />
                    <textarea
                      className="form-textarea edit-textarea"
                      rows={2}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Task description"
                      disabled={isActionActive}
                    />
                    <div className="edit-controls-row">
                      <select
                        className="form-select edit-select"
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                        disabled={isActionActive}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                      <div className="edit-action-btns">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSaveEdit(task._id)}
                          disabled={isActionActive}
                        >
                          {isActionActive ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={cancelEditing}
                          disabled={isActionActive}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Normal View Mode */
                  <>
                    <div className="task-card-top">
                      <div className="task-card-meta">
                        <span className={getPriorityBadgeClass(task.priority)}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span
                          className={`status-pill ${
                            task.completed ? 'status-completed' : 'status-pending'
                          }`}
                        >
                          {task.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      <span className="task-date">
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : ''}
                      </span>
                    </div>

                    <h3
                      className={`task-title ${
                        task.completed ? 'title-completed' : ''
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}

                    <div className="task-actions-toolbar">
                      <button
                        type="button"
                        className={`btn btn-toggle ${
                          task.completed ? 'btn-mark-pending' : 'btn-mark-completed'
                        }`}
                        onClick={() => handleToggleComplete(task)}
                        disabled={isActionActive || task.isPending}
                        title="Toggle status"
                      >
                        {task.completed ? 'Mark Incomplete' : 'Mark Done'}
                      </button>

                      <div className="task-secondary-actions">
                        <button
                          type="button"
                          className="btn btn-action-edit"
                          onClick={() => startEditing(task)}
                          disabled={isActionActive || task.isPending}
                          title="Edit Task"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-action-delete"
                          onClick={() => handleDeleteTask(task._id, task.title)}
                          disabled={isActionActive || task.isPending}
                          title="Delete Task"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TaskManager;
