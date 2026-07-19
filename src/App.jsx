import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import router components

// Import Navbar component
import Navbar from './components/Navbar';

// Import Pages
import Home from './pages/Home';
import ProjectsPage from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Import CSS stylesheet
import './App.css';

// Main App component
function App() {
  return (
    <div className="app-container">
      {/* 1. Navigation bar displayed on all pages */}
      <Navbar />

      {/* 2. Routing configuration */}
      <Routes>
        {/* Home route displaying the Header, About, Skills, and Footer */}
        <Route path="/" element={<Home />} />
        
        {/* Projects route displaying Work Portfolio projects list */}
        <Route path="/projects" element={<ProjectsPage />} />
        
        {/* Contact route displaying message input and state controls */}
        <Route path="/contact" element={<Contact />} />
        
        {/* Catch-all route displaying 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
