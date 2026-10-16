# Student Portfolio (24IT102)

**Subject:** Advanced Web Development Frameworks (ITUE301)  
**Practical No:** 01  
**Practical Title:** Introduction to React and Component Architecture  
**University:** CHARUSAT – Charotar University of Science and Technology  
**Student ID:** 24IT102  

---

## 1. Project Objective
The objective of this practical is to set up a modern React development environment using **Vite** and construct a responsive single-page student portfolio using modular, independently structured, and reusable functional components.

---

## 2. Technologies Used
- **React 19** (Functional Components, Hooks, JSX)
- **Vite** (Next-generation front-end build tool & local dev server)
- **JavaScript (ES6+)**
- **HTML5 & Vanilla CSS3** (CSS Grid, Flexbox, CSS Variables, Responsive Design)
- **npm** (Node Package Manager)

---

## 3. Project Directory Structure
```text
student-portfolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx      # Hero banner; accepts name, title, and themeColor props
│   │   ├── NavBar.jsx      # Responsive navigation with active section scroll tracking
│   │   ├── About.jsx       # Academic bio & student details passed via props
│   │   ├── Skills.jsx      # Dynamic skill badges rendered via .map() from skillList prop
│   │   ├── Projects.jsx    # Exactly three academic project cards rendered dynamically
│   │   └── Footer.jsx      # Contact info, social links, and copyright via props
│   ├── App.css             # Component-level layout and responsive styles
│   ├── App.jsx             # Main parent component composing all child components & managing data flow
│   ├── index.css           # Global CSS variables, reset, and typography
│   └── main.jsx            # React root injection point using ReactDOM.createRoot
├── .gitignore              # Ignores node_modules, dist, logs, and OS caches
├── index.html              # HTML5 entry template
├── package.json            # Scripts and dependencies configuration
└── README.md               # Documentation and execution guide
```

---

## 4. Component Descriptions & Props Architecture

1. **`App.jsx` (Root Orchestrator):**
   - Serves as the single source of truth for portfolio data (owner name, theme color, student details, skills array, and project list).
   - Composes all child components (`Header`, `NavBar`, `About`, `Skills`, `Projects`, `Footer`) in a clean, semantic layout.

2. **`Header.jsx`:**
   - Displays the student's name, title, and course badge.
   - Accepts `name`, `title`, and `themeColor` as props.
   - Applies the `themeColor` (`#1d4ed8`) as an inline style:
     ```jsx
     const headerStyle = { backgroundColor: themeColor || '#1e40af' };
     ```

3. **`NavBar.jsx`:**
   - Features responsive navigation links (`Home`, `About`, `Skills`, `Projects`, `Contact`).
   - Implements lightweight active section detection via a scroll listener and `useState`.
   - Includes a mobile menu toggle without extra routing libraries.

4. **`About.jsx`:**
   - Displays an introductory biography and a structured academic overview (degree, branch, roll number, college, and career goals).
   - Receives academic data via the `studentDetails` prop.

5. **`Skills.jsx`:**
   - Receives the `skillList` array prop from `App.jsx`.
   - Iterates over the skills using JavaScript's `.map()` method and assigns each item a unique `key`.

6. **`Projects.jsx`:**
   - Displays exactly three student projects.
   - Each project card showcases the title, description, and technology tags rendered dynamically with proper keys.

7. **`Footer.jsx`:**
   - Displays student contact information, location, profile links, and dynamic copyright year passed down as props.

---

## 5. How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Steps
1. Navigate into the project directory:
   ```bash
   cd student-portfolio
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173/
   ```

5. To generate a production build:
   ```bash
   npm run build
   ```

---

## 6. GitHub Submission Instructions

To push this repository to GitHub under the name `portfolio-24it102`:

1. Open your terminal in the root folder (`Portfolio-24IT102/`):
   ```bash
   git init
   git add .
   git commit -m "Implement React portfolio using reusable components and props"
   ```

2. Create a new public repository on GitHub named `portfolio-24it102`.

3. Link the remote and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/portfolio-24it102.git
   git push -u origin main
   ```
