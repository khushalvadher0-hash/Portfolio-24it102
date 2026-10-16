import Header from './components/Header';
import NavBar from './components/NavBar';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './App.css';

function App() {
  // 1. Portfolio owner information & theme configuration
  const ownerName = '24IT102';
  const ownerTitle = 'Undergraduate IT Student & Front-End Developer';
  const themeColor = '#1d4ed8'; // Coordinated deep royal blue

  // 2. Student details passed to About component
  const studentDetails = {
    education: 'B.Tech in Information Technology',
    college: 'CSPIT / DEPSTAR',
    university: 'CHARUSAT University',
    branch: 'Information Technology',
    rollNo: '24IT102',
    careerGoal: 'To build high-performance, accessible, and user-centric web applications using modern web ecosystems.',
  };

  // 3. Skills array passed to Skills component via skillList prop
  const skills = [
    'HTML5 & Semantic Markup',
    'CSS3 & Modern Layouts (Flexbox/Grid)',
    'JavaScript (ES6+)',
    'React.js Fundamentals',
    'Component Architecture & Props',
    'Vite Build Tool',
    'Git & GitHub Version Control',
    'Responsive Web Design',
  ];

  // 4. Exactly three academic projects passed to Projects component
  const projects = [
    {
      id: 1,
      title: 'Student Portfolio Website',
      description:
        'A single-page, component-based student portfolio built using React and Vite, featuring active navigation tracking and modular architecture.',
      technologies: ['React', 'Vite', 'JSX', 'CSS3'],
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

  // 5. Contact information passed to Footer component
  const contactInfo = {
    email: '24it102@charusat.edu.in',
    location: 'Changa, Anand, Gujarat, India',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  };

  return (
    <div className="portfolio-app">
      {/* Navigation bar with active section highlight */}
      <NavBar />

      {/* Hero Header with name, title, and themeColor passed as props */}
      <Header
        name={ownerName}
        title={ownerTitle}
        themeColor={themeColor}
      />

      <main>
        {/* About section receiving studentDetails prop */}
        <About studentDetails={studentDetails} />

        {/* Skills section receiving skillList prop rendered dynamically */}
        <Skills skillList={skills} />

        {/* Projects section receiving projectList prop with exactly 3 projects */}
        <Projects projectList={projects} />
      </main>

      {/* Footer section receiving contactInfo and copyrightYear props */}
      <Footer contactInfo={contactInfo} copyrightYear={2026} />
    </div>
  );
}

export default App;
