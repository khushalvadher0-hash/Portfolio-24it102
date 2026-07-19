import React from 'react';
// Import all components in the correct order
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';

// Import CSS stylesheet
import './App.css';

// Main App component
function App() {
  // We define the skill list array to pass it to the Skills component as props
  const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Python'];

  return (
    <div className="app-container">
      {/* 1. Header component with name and themeColor props */}
      <Header 
        name="Khushal Vadher" 
        themeColor="yellow" 
      />
      
      {/* 2. About component */}
      <About />
      
      {/* 3. Skills component with skillList array passed as a prop */}
      <Skills 
        skillList={skills} 
      />
      
      {/* 4. Projects component */}
      <Projects />
      
      {/* 5. Footer component */}
      <Footer />
    </div>
  );
}

export default App;
