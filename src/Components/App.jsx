import React, { useState } from "react";
import Help from './Help.jsx';
import About from './About.jsx';

const initialState = {
  filePath: "",
  fileName: "",
  inFileType: "",
  outFileType: "",
  mappings: [],
  additionalSettings: [],
};

function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const [data, setData] = useState(initialState);
  async function rebabel() {
    const response = await window.pythonApi.rebabelConvert();
  }

  async function handleSelectFile() {
    //returns object with filePath and fileName
    const response = await window.pythonApi.getFile();

    if (response !== undefined) {
      setData((data) => ({
        ...data,
        fileName: response.fileName,
        filePath: response.filePath,
      }));
    }
  }

  function handleSelectType(e) {
    if (e.target.name === "inputType") {
      setData((data) => ({ ...data, inFileType: e.target.value }));
    } else if (e.target.name === "outputType") {
      setData((data) => ({ ...data, outFileType: e.target.value }));
    }
  }

  return (
    <div className="flex-base">
      <header>
        <button onClick={() => setIsHelpOpen(!isHelpOpen)}>Help</button>
        <h2>Gap App</h2>
        <button onClick={() => setIsAboutOpen(!isAboutOpen)}>About</button>
      </header>
      
      <section className="input-fields">
        <div className="select-file">
          <input
            id="file-in"
            readOnly="readonly"
            placeholder="Select File..."
            value={data.fileName}
          />
          <button id="file-in-btn" onClick={() => handleSelectFile()}>
            Browse
          </button>
        </div>
        <div id="file-type">
          <label>File input type</label>
          <select
            aria-label="Select File Type"
            name="inputType"
            onChange={(e) => handleSelectType(e)}
          >
            <option defaultValue=""></option>
            <option value="flextext">Flextext</option>
            <option value="conllu">Conllu</option>
            <option value="nlp_pos">NLP</option>
          </select>
        </div>
        <div>Mappings?</div>
        <div>Additional Settings?</div>
        <div id="file-type">
          <label>File output type</label>
          <select
            aria-label="Select File Type"
            name="outputType"
            onChange={(e) => handleSelectType(e)}
          >
            <option defaultValue=""></option>
            <option value="flextext">Flextext</option>
            <option value="nlp_pos">NLP</option>
          </select>
        </div>
        <div className="convert-btn">
          <button id="convertBtn" onClick={() => rebabel()}>
            Convert
          </button>
        </div>
      </section>
      {/* Dialog component */}
      <Help isOpen={isHelpOpen} onClose={() => setIsHelpOpen(!isHelpOpen)} />
      <About isOpen={isAboutOpen} onClose={() => setIsAboutOpen(!isAboutOpen)} />
    </div>
  );
}

export default App;
