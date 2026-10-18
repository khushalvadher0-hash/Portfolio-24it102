import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';

function Home({ ownerName, ownerTitle, themeColor, studentDetails, skills }) {
  return (
    <div className="home-page">
      {/* Hero Header with name, title, and themeColor */}
      <Header
        name={ownerName}
        title={ownerTitle}
        themeColor={themeColor}
      />

      {/* Main Portfolio Sections */}
      <About studentDetails={studentDetails} />
      <Skills skillList={skills} />
    </div>
  );
}

export default Home;
