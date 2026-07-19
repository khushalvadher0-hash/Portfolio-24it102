import React from 'react';

// This is the Skills component.
// It receives a 'skillList' array through props.
function Skills(props) {
  return (
    <section className="skills-section">
      <h3>My Skills</h3>
      <ul>
        {/* We use the map() method to loop through the skillList array */}
        {/* For each skill in the array, we return a list item (li) */}
        {props.skillList.map(function(skill, index) {
          return <li key={index}>{skill}</li>;
        })}
      </ul>
    </section>
  );
}

export default Skills;
