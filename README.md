# Student Portfolio (24IT102)

**Subject:** Advanced Web Development Frameworks (ITUE301)  
**Practical No:** 03  
**Practical Title:** API Integration and Data Rendering in React  
**University:** CHARUSAT – Charotar University of Science and Technology  
**Faculty:** Faculty of Technology and Engineering  
**Student ID:** 24IT102  

---

## 1. Practical Objective
The objective of Practical 3 is to integrate an external public REST API into the React portfolio application and dynamically render live data while preserving all features from Practical 1 (modular components, props) and Practical 2 (React Router, controlled forms, state toggles, dark mode, 404 page):
1. Fetch live public repositories dynamically from the **GitHub REST API** without requiring an API key.
2. Manage and handle asynchronous operations using React's **`useEffect`**, **`useState`**, and the native browser **`fetch()`** API.
3. Handle the complete asynchronous lifecycle:
   - **Loading State:** Display a reusable spinner and status message (`Spinner.jsx`) while the request is in flight.
   - **Error State:** Display an informative error message (`ErrorMessage.jsx`) with HTTP failure explanations and an interactive **Retry** button.
   - **Success State:** Dynamically render repository cards using JavaScript's `.map()`, with proper `key={repo.id}`.
4. Implement client-side real-time **Search & Filtering** by repository name using `useState` without triggering redundant network requests.
5. Provide accessible, secure external links opening in new tabs (`target="_blank" rel="noopener noreferrer"`).

---

## 2. GitHub REST API Endpoint

- **API Endpoint:** `https://api.github.com/users/khushalvadher0-hash/repos`
- **Method:** `GET`
- **Authentication:** Unauthenticated public requests (rate limit: 60 requests/hour per IP).
- **Target GitHub User:** `khushalvadher0-hash`

---

## 3. Technologies Used
- **React 19** (`useState`, `useEffect`, JSX, Functional Components)
- **Native Browser Fetch API** (`window.fetch`, `async/await`, `try/catch/finally`)
- **React Router DOM v7** (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `Link`)
- **Vite** (Next-generation front-end build tool & local development server)
- **HTML5 & Vanilla CSS3** (CSS Grid, Flexbox, CSS Variables, Animations, Dark Mode tokens)

---

## 4. Components Added and Modified

| Component / File | Status | Description & Purpose |
| :--- | :--- | :--- |
| `src/components/Spinner.jsx` | **Created** | Reusable loading indicator displaying an animated circular spinner and message (`Loading repositories from GitHub...`). |
| `src/components/ErrorMessage.jsx` | **Created** | Reusable error card explaining possible network issues, API rate limits (HTTP 403), or invalid user (HTTP 404), with a **Retry** button. |
| `src/components/Projects.jsx` | **Updated** | Integrates GitHub API fetch logic, manages `repos`, `loading`, `error`, and `searchTerm` states, and renders repository cards or empty states. |
| `src/pages/ProjectsPage.jsx` | **Updated** | Page layout container hosting the updated `Projects.jsx` with updated Practical 3 route badges and descriptions. |
| `src/App.css` | **Updated** | Added styling for the circular spinner, error message card, retry button, repository search input, stats badge, and dark mode overrides. |
| `src/App.jsx` | **Preserved** | Preserves all routes (`/`, `/projects`, `/contact`, `*`), dark/light mode toggle, and shared footer. |

---

## 5. Technical Implementation & State Architecture

### A. State Variables (`useState`)
In `src/components/Projects.jsx`, four beginner-friendly state variables manage the view:
```jsx
// 1. Repositories fetched from GitHub API
const [repos, setRepos] = useState([]);

// 2. Loading indicator while request is in flight
const [loading, setLoading] = useState(true);

// 3. Error message if fetch fails
const [error, setError] = useState(null);

// 4. Search query for real-time client-side filtering
const [searchTerm, setSearchTerm] = useState('');
```

### B. Fetching with `useEffect`, `async/await`, and `try/catch/finally`
The API request is initiated when the component mounts using `useEffect` with an empty dependency array (`[]`):
```jsx
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
    // Ensure loading state is set to false after both success and failure
    setLoading(false);
  }
};

useEffect(() => {
  fetchRepositories();
}, []);
```

### C. Client-Side Search and Filtering
The search query filters the already-fetched `repos` array in memory. It is case-insensitive and does **not** trigger redundant network calls:
```jsx
const filteredRepos = repos.filter((repo) =>
  repo.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
);
```

### D. Repository Card Rendering
Each card displays:
- Repository Name (`repo.name`)
- Description (`repo.description` or fallback)
- External link with `target="_blank"` and `rel="noopener noreferrer"` (`repo.html_url`)
- Star count (`repo.stargazers_count`)
- Primary programming language (`repo.language`)
- Unique key: `key={repo.id}`

---

## 6. How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation and Execution
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the Vite local development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173/projects
   ```

4. Build for production verification:
   ```bash
   npm run build
   ```

---

## 7. Verification and Testing Checklist

- [x] **Home, Projects, and Contact routes**: All routes navigate seamlessly with active navigation highlighting.
- [x] **GitHub REST API Integration**: Dynamically requests data from `https://api.github.com/users/khushalvadher0-hash/repos`.
- [x] **Loading Spinner**: Animated spinner and message appear during fetch.
- [x] **Repository Display**: Repositories (`RTO-webapp`, `Touch-Of-Joy`, etc.) render with star badges, descriptions, and language tags.
- [x] **Secure Links**: Each repository link opens in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.
- [x] **Real-time Search**: Filtering by repository name works immediately without extra network requests; empty query matches show a friendly message.
- [x] **Error Handling & Retry Button**: Simulating a non-existent user or failed response displays `ErrorMessage.jsx` with an interactive Retry button.
- [x] **No Infinite Loops**: Initial fetch runs once on mount with `[]` dependency array.
- [x] **Dark / Light Mode**: Theme toggles properly apply to all repository cards, search input, spinner, and error banner.
- [x] **Build Verification**: `npm run build` completes with 0 errors.

---

## 8. Viva & Theory Cheat Sheet

- **`useState`**: Hook to declare reactive state variables in functional components that trigger re-renders when updated.
- **`useEffect`**: Hook used to perform side effects (such as fetching data from an API, subscribing to events, or manipulating the DOM). An empty dependency array `[]` ensures it runs only once when the component mounts.
- **`fetch()`**: Built-in browser web API to make HTTP network requests returning Promises. Unlike Axios, `fetch()` only rejects if there is a network outage; it does **not** reject for HTTP errors like 404 or 500, requiring manual `response.ok` checks.
- **`async/await`**: Syntactic sugar over Promises allowing asynchronous code to be written and read like synchronous code.
- **`try/catch/finally`**: Exception handling construct. Code in `try` executes; errors jump to `catch`; and `finally` runs unconditionally to clean up resources or reset `loading` states.
- **`.map()`**: Standard JavaScript array method used to transform array items into JSX elements dynamically in React, requiring a unique `key` prop on the top-level element.
