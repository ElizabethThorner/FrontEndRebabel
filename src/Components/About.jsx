import React from 'react';

const About = ({ isOpen, onClose }) => {
  return (
    <dialog open={isOpen} className="modal-overlay">
      <article>
        <h2>About</h2>
        <p>
          Linguists rely on a variety of specialized software tools to document and preserve endangered languages.
          A common challenge they face is the need to transfer language data between different applications, a process that currently lacks an automated and user-friendly solution.
          Rebabel provides an efficient and intuitive solution for converting NLP output files into language data formats compatible with software such as Fieldworks Language Explorer (FLEx) and ELAN.
        </p>
        <h3>Team Members:</h3>
        <ul>
          <li>Joseph Barron: Backend Developer/Scrum Master</li>
          <li>Adassa Coimin: Frontend/Backend Developer</li>
          <li>Matthew Denslinger: Frontend Developer</li>
          <li>Elizabeth Thorner: Backend Developer/Project Manager</li>
          <li>Darren Wang: Frontend Developer</li>
        </ul>
        <footer>
          <button className="backBtn" onClick={onClose}>Back</button>
        </footer>
      </article>
    </dialog>
  );
};

export default About;
