import React from "react";
import styles from "./NLPConfig.module.css";
import Error from "./Error.jsx";

function NLPConfig({ isOpen, onClose, data, errors, setErrorState, setData }) {
  //Creates copy of FileNames for selecting two file input
  const fileNames = [...data.fileName];
  fileNames.unshift("");

  function handleRadioChange(e) {
    data.additionalArguments.nlpFileType = e.target.id;

    setErrorState(false, "", "nlpFileType");
  }

  function handleDelimiterChange(e) {
    data.additionalArguments.nlpDelimiter = e.target.value;

    if (e.target.value.length > 1) {
      setErrorState(
        true,
        "Delimiter can only be a single character",
        "nlpDelimiter",
        true
      );
    } else if (e.target.value === "") {
      setErrorState(true, "Enter a delimiter value", "nlpDelimiter", true);
    } else {
      setErrorState(false, "", "nlpDelimiter");
    }
  }

  function handleFileChange(e) {
    if (e.target.name === "partOfSpeech") {
      data.additionalArguments.partOfSpeechFile = e.target.value;

      if (e.target.value === "") {
        setErrorState(true, "Please Select a File", "partOfSpeechFile", true);
      } else if (e.target.value === data.additionalArguments.languageFile) {
        setErrorState(
          true,
          "File name already choosen",
          "partOfSpeechFile",
          true
        );
      } else {
        setErrorState(false, "", "partOfSpeechFile");
      }
    } else if (e.target.name === "language") {
      data.additionalArguments.languageFile = e.target.value;

      if (e.target.value === "") {
        setErrorState(true, "Please Select a File", "languageFile", true);
      } else if (e.target.value === data.additionalArguments.partOfSpeechFile) {
        setErrorState(true, "File name already choosen", "languageFile", true);
      } else {
        setErrorState(false, "", "languageFile");
      }
    }
  }

  return (
    <dialog open={isOpen} className="modal-overlay">
      <article>
        <h2>NLP Configuration Settings</h2>
        <hr></hr>
        <section className={styles.nlpInput}>
          <fieldset>
            <legend>NLP File Type:</legend>
            <input
              type="radio"
              id="combined"
              name="nlpfileType"
              checked={data.additionalArguments.nlpFileType === "combined"}
              onChange={(e) => handleRadioChange(e)}
              className={styles.combined}
              {...errors.nlpFileType.ariaProps}
            />
            <label htmlFor="combined">Combined</label>
            <input
              type="radio"
              id="separate"
              name="nlpfileType"
              checked={data.additionalArguments.nlpFileType === "separate"}
              onChange={(e) => handleRadioChange(e)}
              {...errors.nlpFileType.ariaProps}
            />
            <label htmlFor="separate">Part of Speech and Language Files</label>
          </fieldset>
          {errors.nlpFileType.status && (
            <p className={styles.error}>Error! Select an NLP File Type</p>
          )}
          {data.additionalArguments.nlpFileType === "combined" && (
            <>
              <div>
                <label>NLP Delimiter ('/' by default)</label>
                <input
                  type="text"
                  id="delimiter"
                  value={data.additionalArguments.nlpDelimiter}
                  onChange={(e) => handleDelimiterChange(e)}
                  {...errors.nlpDelimiter.ariaProps}
                />
                <Error>{errors.nlpDelimiter.message}</Error>
              </div>
            </>
          )}
          {data.additionalArguments.nlpFileType === "separate" && (
            <div>
              {data.fileName.length < 2 && (
                <p className={styles.error}>
                  Error! Please Upload a Part of Speech File and a Language File
                </p>
              )}
              {data.fileName.length > 2 && (
                <p className={styles.error}>
                  Error! Please Upload one Part of Speech File and one Language
                  File
                </p>
              )}
              {data.fileName.length === 2 && (
                <div>
                  <label>Part of Speech File</label>
                  <select
                    name="partOfSpeech"
                    onChange={(e) => handleFileChange(e)}
                    value={data.additionalArguments.partOfSpeechFile}
                    aria-label="Select Part of Speech File"
                    {...errors.partOfSpeechFile.ariaProps}
                  >
                    {fileNames.map((name) => (
                      <option value={name} key={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <Error>{errors.partOfSpeechFile.message}</Error>
                  <label>Language File</label>
                  <select
                    name="language"
                    onChange={(e) => handleFileChange(e)}
                    value={data.additionalArguments.languageFile}
                    aria-label="Select Language File"
                    {...errors.languageFile.ariaProps}
                  >
                    {fileNames.map((name) => (
                      <option value={name} key={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <Error>{errors.languageFile.message}</Error>
                </div>
              )}
            </div>
          )}
        </section>
        <footer>
          <button onClick={onClose}>Close</button>
        </footer>
      </article>
    </dialog>
  );
}

export default NLPConfig;
