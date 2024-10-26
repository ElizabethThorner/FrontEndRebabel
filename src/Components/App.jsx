import React, { useState } from "react";
import Help from "./Help.jsx";
import About from "./About.jsx";
import Mappings from "./Mappings.jsx";
import NLPConfig from "./NLPConfig.jsx";
import Convert from "./Convert.jsx";
import SelectFiles from "./SelectFiles.jsx";
import OutputFileConfig from "./OutputFileConfig.jsx";
import errorStates from "../ErrorStates.js";
import SelectTypes from "./SelectTypes.jsx";

const initialState = {
  filePath: [],
  fileName: [],
  inFileType: "",
  outFileType: "",
  delimiter: "/",
  nlpFileType: "",
  partOfSpeechFile: "",
  languageFile: "",
  mappings: [
    { in_type: "", out_type: "" },
    { in_feature: "", out_feature: "" },
  ],
  root: "phrase",
  skip: ["morph"],
};

function App() {
  //Sets state for file conversion
  const [data, setData] = useState(initialState);
  //Sets state for errors
  const [errors, setErrors] = useState(errorStates);
  //Set state for modals
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMappingsOpen, setMappingsOpen] = useState(false);
  const [isNLPConfigOpen, setNLPConfigOpen] = useState(false);
  const [isOutputFileConfigOpen, setOutputFileConfigOpen] = useState(false);
  //Sets loading status for file conversion
  const [isLoading, setIsLoading] = useState(false);

  function setErrorState(
    errorStatus,
    errorMessage,
    propName,
    ariaStatus = undefined
  ) {
    setErrors((errors) => ({
      ...errors,
      [propName]: {
        status: errorStatus,
        message: errorMessage,
        ariaProps: { "aria-invalid": ariaStatus },
      },
    }));
  }

  return (
    <div className="container flex-base">
      <header>
        <h2>Gap App</h2>
      </header>

      <section className="input-fields">
        <SelectFiles
          data={data}
          setData={setData}
          isLoading={isLoading}
          errors={errors}
          setErrorState={setErrorState}
        />
        <SelectTypes
          label="File Input Type"
          selectConfig="inputType"
          data={data}
          setData={setData}
          isLoading={isLoading}
          setNLPConfigOpen={setNLPConfigOpen}
        />
        <SelectTypes
          label="File Output Type"
          selectConfig="outputType"
          data={data}
          setData={setData}
          isLoading={isLoading}
          setOutputFileConfigOpen={setOutputFileConfigOpen}
        />
        <div className="settings-container">
          <button onClick={() => setMappingsOpen(true)} disabled={isLoading}>
            Mappings
          </button>
        </div>
        <Convert
          data={data}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setErrorState={setErrorState}
        />
      </section>
      {/* Dialog component */}
      <Help isOpen={isHelpOpen} onClose={() => setIsHelpOpen(!isHelpOpen)} />
      <About
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(!isAboutOpen)}
      />
      {isMappingsOpen && (
        <Mappings
          isOpen={isMappingsOpen}
          onClose={() => setMappingsOpen(!isMappingsOpen)}
          data={data}
          setData={setData}
        />
      )}
      {isNLPConfigOpen && (
        <NLPConfig
          isOpen={isNLPConfigOpen}
          onClose={() => setNLPConfigOpen(!isNLPConfigOpen)}
          data={data}
          setData={setData}
        />
      )}
      {isOutputFileConfigOpen && (
        <OutputFileConfig
          isOpen={isOutputFileConfigOpen}
          onClose={() => setOutputFileConfigOpen(!isOutputFileConfigOpen)}
          data={data}
          setData={setData}
        />
      )}
    </div>
  );
}

export default App;
