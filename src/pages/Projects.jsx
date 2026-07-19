import React from 'react';
// Import Projects list and Footer components
import ProjectsList from '../components/Projects';
import Footer from '../components/Footer';

// This is the Projects page component.
function Projects() {
  return (
    <div className="page-container">
      <h2 className="page-heading">My Work Portfolio</h2>
      {/* Displaying the existing Projects list component */}
      <ProjectsList />
      <Footer />
    </div>
  );
}

export default Projects;
