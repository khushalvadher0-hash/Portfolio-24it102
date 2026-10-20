# React DevTools Profiler Analysis & Notes — Practical 8

**Subject:** Advanced Web Development Frameworks (ITUE301)  
**Student ID:** 24IT102  

---

## 1. Objective
Identify, profile, and evaluate re-render behavior in the component tree using the React DevTools Profiler, focusing on state updates in `TaskManager.jsx` and parent-child interaction.

---

## 2. Profiling Candidate & Observation
- **Candidate:** `TaskManager.jsx` list rendering (`tasks.map`) and child controls during text input changes (e.g. typing in the search bar or task creation input).
- **Hypothesis:** When typing into the title or description form input, the parent component state updates on every keystroke (`onChange`). Any unmemoized children or secondary components re-render even though their props did not change.
- **Profiling Steps:**
  1. Open Chrome DevTools and switch to the **Profiler** tab (React DevTools extension).
  2. Click the gear icon (Settings) and check *"Record why each component rendered while profiling"*.
  3. Click **Start Profiling** (blue circle).
  4. Type a character into the "Task Title" input field or toggle dark mode.
  5. Click **Stop Profiling**.
  6. Inspect flamegraph: Observe the commit duration, render reason (*"Hook X changed"*), and whether children re-rendered.

---

## 3. Template for Laboratory Submission Record

| Interaction Profiled | Component Inspected | Render Reason Reported | Optimization Applied / Recommendation |
| :--- | :--- | :--- | :--- |
| Typing in "Task Title" | `TaskStatsModal` (when closed) | Did not render (Lazy + conditional unmounted) | Retain conditional rendering + lazy import |
| Dark mode toggle in `App.jsx` | `PageLoader` (during chunk load) | Re-rendered due to parent state | Lightweight CSS spinner, negligible cost |
| Task status toggle in list | Individual Task Card | Parent list array re-rendered | Acceptable for current list size; `React.memo` recommended if list exceeds 100 items |
