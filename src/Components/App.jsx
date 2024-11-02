import React, { useState } from "react";
import Mappings from "./Mappings.jsx";
import NLPConfig from "./NLPConfig.jsx";
import Convert from "./Convert.jsx";
import SelectFiles from "./SelectFiles.jsx";
import OutputFileConfig from "./OutputFileConfig.jsx";
import errorStates from "../ErrorStates.js";
import SelectTypes from "./SelectTypes.jsx";
import DisplayResults from "./DisplayResults.jsx";

const initialState = {
  filePath: [],
  fileName: [],
  inFileType: "",
  outFileType: "",
  mappings: [[], []],
  additionalArguments: {
    root: "phrase", 
    skip: ["morph"], 
    nlpDelimiter: "/"
  }
};

function App() {
  //Sets state for file conversion
  const [data, setData] = useState(initialState);
  //Sets state for errors
  const [errors, setErrors] = useState(errorStates);
  //Sets Conversion Results
  const [conversionResult, setConversionResult] = useState({
    success: true,
    message: "An Unexpected Error Occured!",
  });
  //Set state for modals
  const [isMappingsOpen, setMappingsOpen] = useState(false);
  const [isNLPConfigOpen, setNLPConfigOpen] = useState(false);
  const [isOutputFileConfigOpen, setOutputFileConfigOpen] = useState(false);
  const [isDisplayResultsOpen, setDisplayResultsOpen] = useState(false);
  //Sets loading status for file conversion
  const [isLoading, setIsLoading] = useState(false);
  //Sets the values for the current included layers in the flextext settings
  const [includedLayerValues, setIncludedLayerValues] = useState([
    "phrase",
    "word",
  ]);

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

  function resetData() {
    setData(initialState);
    setErrors(errorStates);
  }
  return (
    <div className="container flex-base">
      <header>
        <h2>reBabel</h2>
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
          errors={errors}
          setErrorState={setErrorState}
          isLoading={isLoading}
          setNLPConfigOpen={setNLPConfigOpen}
        />
        <SelectTypes
          label="File Output Type"
          selectConfig="outputType"
          data={data}
          setData={setData}
          errors={errors}
          setErrorState={setErrorState}
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
          errors={errors}
          setIsLoading={setIsLoading}
          setNLPConfigOpen={setNLPConfigOpen}
          setOutputFileConfigOpen={setOutputFileConfigOpen}
          setErrorState={setErrorState}
          setDisplayResultsOpen={setDisplayResultsOpen}
          setConversionResult={setConversionResult}
          setMappingsOpen={setMappingsOpen}
        />
      </section>
      {/* Dialog component */}
      {isMappingsOpen && (
        <Mappings
          isOpen={isMappingsOpen}
          onClose={() => setMappingsOpen(!isMappingsOpen)}
          data={data}
          setData={setData}
          errors={errors}
          setErrorState={setErrorState}
        />
      )}
      {isNLPConfigOpen && (
        <NLPConfig
          isOpen={isNLPConfigOpen}
          onClose={() => setNLPConfigOpen(!isNLPConfigOpen)}
          data={data}
          errors={errors}
          setErrorState={setErrorState}
          setData={setData}
        />
      )}
      {isOutputFileConfigOpen && (
        <OutputFileConfig
          isOpen={isOutputFileConfigOpen}
          onClose={() => setOutputFileConfigOpen(!isOutputFileConfigOpen)}
          data={data}
          setData={setData}
          errors={errors}
          setErrorState={setErrorState}
          includedLayerValues={includedLayerValues}
          setIncludedLayerValues={setIncludedLayerValues}
        />
      )}
      {isDisplayResultsOpen && (
        <DisplayResults
          isOpen={isDisplayResultsOpen}
          onClose={() => setDisplayResultsOpen(false)}
          conversionResult={conversionResult}
          data={data}
          resetData={resetData}
        />
      )}
    </div>
  );
}

export default App;
