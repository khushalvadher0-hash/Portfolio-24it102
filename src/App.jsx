import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  // 1. Dark / Light mode state management
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // 2. Portfolio owner information & theme configuration
  const ownerName = '24IT102';
  const ownerTitle = 'Undergraduate IT Student & Front-End Developer';
  const themeColor = '#1d4ed8'; // Coordinated deep royal blue

  // 3. Student details passed to About component
  const studentDetails = {
    education: 'B.Tech in Information Technology',
    college: 'CSPIT / DEPSTAR',
    university: 'CHARUSAT University',
    branch: 'Information Technology',
    rollNo: '24IT102',
    careerGoal: 'To build high-performance, accessible, and user-centric web applications using modern web ecosystems.',
  };

  // 4. Skills array passed to Skills component via skillList prop
  const skills = [
    'HTML5 & Semantic Markup',
    'CSS3 & Modern Layouts (Flexbox/Grid)',
    'JavaScript (ES6+)',
    'React.js Fundamentals',
    'React Router (SPA Navigation)',
    'State Management (useState)',
    'Component Architecture & Props',
    'Vite Build Tool',
    'Git & GitHub Version Control',
  ];

  // 5. Exactly three academic projects passed to Projects component
  const projects = [
    {
      id: 1,
      title: 'Student Portfolio Website',
      description:
        'A single-page, multi-route student portfolio built using React, Vite, and React Router, featuring active navigation tracking and useState management.',
      technologies: ['React', 'React Router', 'Vite', 'CSS3'],
    },
    {
      id: 2,
      title: 'Course Registration Portal UI',
      description:
        'A frontend course selection interface enabling students to view subjects, credit allocations, and semester schedules with live filtering.',
      technologies: ['React', 'JavaScript', 'CSS Grid'],
    },
    {
      id: 3,
      title: 'Interactive Quiz Application',
      description:
        'A quiz game featuring dynamic question rendering, score calculation, instant feedback, and responsive layout for mobile study.',
      technologies: ['JavaScript', 'HTML5', 'CSS Flexbox'],
    },
  ];

  // 6. Contact information passed to Footer component
  const contactInfo = {
    email: '24it102@charusat.edu.in',
    location: 'Changa, Anand, Gujarat, India',
    github: 'https://github.com/khushalvadher0-hash/Portfolio-24it102',
    linkedin: 'https://linkedin.com',
  };

  return (
    <div className={`portfolio-app ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Navigation bar with route links and dark/light mode toggle */}
      <NavBar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

      {/* Main Content Area defining application routes */}
      <main className="app-main-content">
        <Routes>
          {/* Route 1: Home page */}
          <Route
            path="/"
            element={
              <Home
                ownerName={ownerName}
                ownerTitle={ownerTitle}
                themeColor={themeColor}
                studentDetails={studentDetails}
                skills={skills}
              />
            }
          />

          {/* Route 2: Projects page */}
          <Route
            path="/projects"
            element={<ProjectsPage />}
          />

          {/* Route 3: Contact page with controlled form */}
          <Route path="/contact" element={<Contact />} />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer displayed across all routes */}
      <Footer contactInfo={contactInfo} copyrightYear={2026} />
    </div>
  );
}

export default App;
