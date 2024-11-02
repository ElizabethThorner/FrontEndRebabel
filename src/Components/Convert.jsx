import React from "react";
import styles from "./Convert.module.css";

function Convert({
  data,
  isLoading,
  errors,
  setIsLoading,
  setNLPConfigOpen,
  setOutputFileConfigOpen,
  setErrorState,
  setDisplayResultsOpen,
  setConversionResult,
  setMappingsOpen
}) {
  function preConvertCheck() {
    let errorOccurred = false;

    //No files uploaded
    if (data.filePath.length === 0) {
      setErrorState(true, "Select a File", "selectFile");
      errorOccurred = true;
    }

    //No import type selected
    if (data.inFileType === "") {
      setErrorState(true, "Select a File Type", "inFileType", true);
      errorOccurred = true;
    }

    //No export type selected
    if (data.outFileType === "") {
      setErrorState(true, "Select a File Type", "outFileType", true);
      errorOccurred = true;
    }

    //No mappings provided
    if (data.filePath.length && data.inFileType && data.outFileType &&
      !data.mappings[0].length && !data.mappings[1].length) {
      setErrorState(true, "Mappings must be provided", "mappings")
      setMappingsOpen(true);
      errorOccurred = true;
    }

    //If NLP is selected as import file type
    if (data.inFileType === "nlp_pos") {
      if (!data.additionalArguments?.nlpFileType) {
        setErrorState(true, "Select an NLP File Type", "nlpFileType", true);
        setNLPConfigOpen(true);
        errorOccurred = true;
      }

      //if combined file type selected
      if (data.additionalArguments?.nlpFileType === "combined") {
        if (!data.additionalArguments?.nlpDelimiter) {
          setErrorState(true, "Enter a delimiter value", "nlpDelimiter", true);
          setNLPConfigOpen(true);
          errorOccurred = true;
        }

        //if delimiter error exists, e.g. delimiter too long
        if (errors.nlpDelimiter.status) {
          setNLPConfigOpen(true);
          errorOccurred = true;
        }
      }

      //if Part of Speech and and Language file are selected
      if (data.additionalArguments?.nlpFileType === "separate") {
        if (!data.additionalArguments?.partOfSpeechFile) {
          setErrorState(true, "Please Select a File", "partOfSpeechFile", true);
          setNLPConfigOpen(true);
          errorOccurred = true;
        }

        if (!data.additionalArguments?.languageFile) {
          setErrorState(true, "Please Select a File", "languageFile", true);
          setNLPConfigOpen(true);
          errorOccurred = true;
        }

        //if errors already exist, e.g. duplicate file names
        if (errors.partOfSpeechFile.status || errors.languageFile.status) {
          setNLPConfigOpen(true);
          errorOccurred = true;
        }
      }
    }

    //checks if root is empty if flextext is selected as the export file type
    if (data.outFileType === "flextext") {
      if (data.additionalArguments.root === "") {
        setErrorState(true, "Select at least one layer", "skipRoot");
        setOutputFileConfigOpen(true);
        errorOccurred = true;
      }
    }

    return errorOccurred;
  }
  async function convertFiles() {
    setIsLoading(true);

    //if an error is thrown
    if (preConvertCheck()) {
      setIsLoading(false);
      return;
    }
    const response = await window.pythonApi.rebabelConvert(data);

    if (response.message !== "cancelled" && response.message !== "empty") {
      setDisplayResultsOpen(true);
      setConversionResult(response);
    }

    setIsLoading(false);
  }
  return (
    <div className={styles.convertBtn}>
      {!isLoading && (
        <button
          id="convertBtn"
          onClick={() => convertFiles()}
          disabled={isLoading}
        >
          Convert
        </button>
      )}
      {isLoading && (
        <span className={styles.loadingStatus} aria-busy="true">
          Converting...
        </span>
      )}
    </div>
  );
}

export default Convert;
