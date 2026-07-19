import React from 'react';
// Import existing components from the components directory
import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';
import Footer from '../components/Footer';

// This is the Home page page component.
// It displays the Header, About, Skills, and Footer.
function Home() {
  const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Python'];

  return (
    <div>
      {/* Passing props exactly as done in Practical 1 */}
      <Header name="Khushal Vadher" themeColor="yellow" />
      <About />
      <Skills skillList={skills} />
      <Footer />
    </div>
  );
}

export default Home;
