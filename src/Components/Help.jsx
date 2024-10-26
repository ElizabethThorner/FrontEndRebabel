import React from 'react';

const Help = ({ isOpen, onClose }) => {
  return (
    <dialog open={isOpen} className="modal-overlay">
      <article>
        <h2>Help</h2>
        <p>
          Welcome to Rebabel! This tool is designed to simplify file format conversions with just a few clicks. Follow the steps below to quickly convert your files and customize the output to your needs.
        </p>
        <ol>
          <li>Select the file to be converted.</li>
          <li>Choose the desired input and output file formats.</li>
          <li>Configure mappings or additional settings, if applicable.</li>
          <li>Click "Convert" and specify the destination for the converted file.</li>
        </ol>
        <footer>
          <button className="backBtn" onClick={onClose}>Back</button>
        </footer>
      </article>
    </dialog>
  );
};

export default Help;
