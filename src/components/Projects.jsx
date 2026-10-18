import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';

function Projects() {
  // State 1: Repositories fetched from GitHub API
  const [repos, setRepos] = useState([]);

  // State 2: Loading indicator while request is in flight
  const [loading, setLoading] = useState(true);

  // State 3: Error message if fetch fails
  const [error, setError] = useState(null);

  // State 4: Search query for real-time client-side filtering
  const [searchTerm, setSearchTerm] = useState('');

  // Target GitHub username
  const githubUsername = 'khushalvadher0-hash';
  const apiEndpoint = `https://api.github.com/users/${githubUsername}/repos`;

  // Fetch function using async/await and try/catch/finally
  const fetchRepositories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint);

      // fetch does not reject on HTTP errors like 404 or 403, so we check response.ok
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded (HTTP 403). Please wait a moment and retry.');
        } else if (response.status === 404) {
          throw new Error(`GitHub user "${githubUsername}" not found (HTTP 404).`);
        } else {
          throw new Error(`Failed to fetch repositories. Server responded with HTTP ${response.status}.`);
        }
      }

      const data = await response.json();
      setRepos(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while fetching repositories.');
    } finally {
      // Ensure loading state is set to false after success or failure
      setLoading(false);
    }
  };

  // Initial effect runs once when the component mounts
  useEffect(() => {
    fetchRepositories();
  }, []);

  // Filter repositories dynamically by name without triggering new API requests
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <section className="portfolio-section" id="projects">
      <div className="section-container">
        <h2 className="section-title">GitHub Repositories</h2>
        <div className="section-divider"></div>
        <p className="section-subtitle">
          Real-time repositories dynamically fetched from the public GitHub REST API for <strong>{githubUsername}</strong>:
        </p>

        {/* Search input (filters the fetched array directly) */}
        {!loading && !error && (
          <div className="search-bar-wrapper">
            <div className="search-input-group">
              <span className="search-icon">🔍</span>
              <input
                id="repo-search-input"
                type="text"
                className="form-input search-input"
                placeholder="Search repositories by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search repositories"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="search-stats">
              Showing {filteredRepos.length} of {repos.length} repositories
            </div>
          </div>
        )}

        {/* 1. Loading State */}
        {loading && <Spinner message="Loading repositories from GitHub..." />}

        {/* 2. Error State */}
        {!loading && error && (
          <ErrorMessage message={error} onRetry={fetchRepositories} />
        )}

        {/* 3. Success State: Display repositories */}
        {!loading && !error && (
          <>
            {/* Empty state: No repositories for user on GitHub */}
            {repos.length === 0 && (
              <div className="empty-state-card">
                <p className="empty-state-title">No Public Repositories Found</p>
                <p className="empty-state-desc">
                  The user <strong>{githubUsername}</strong> currently does not have any public repositories.
                </p>
              </div>
            )}

            {/* Empty state: Search query returned no matches */}
            {repos.length > 0 && filteredRepos.length === 0 && (
              <div className="empty-state-card">
                <p className="empty-state-title">No Matching Repositories</p>
                <p className="empty-state-desc">
                  No repositories match your search for &quot;<strong>{searchTerm}</strong>&quot;.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Repositories Grid */}
            {filteredRepos.length > 0 && (
              <div className="projects-grid">
                {filteredRepos.map((repo) => (
                  <article key={repo.id} className="project-card repo-card">
                    <div className="project-card-header">
                      <div className="repo-top-row">
                        <span className="repo-icon">📦</span>
                        <div className="repo-stats-badge">
                          ⭐ {repo.stargazers_count ?? 0}
                        </div>
                      </div>
                      <h3 className="project-title repo-title">{repo.name}</h3>
                    </div>

                    <p className="project-description repo-description">
                      {repo.description || 'No description provided for this repository.'}
                    </p>

                    <div className="repo-footer">
                      {repo.language && (
                        <div className="repo-language">
                          <span className="language-dot"></span>
                          <span className="language-name">{repo.language}</span>
                        </div>
                      )}
                      {!repo.language && (
                        <div className="repo-language repo-language-none">
                          <span className="language-name">Plain / Multi</span>
                        </div>
                      )}

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repo-link-btn"
                        id={`repo-link-${repo.id}`}
                      >
                        View on GitHub ↗
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Projects;
