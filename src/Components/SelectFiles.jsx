import React, { useEffect } from "react";
import styles from "./SelectFiles.module.css";
import Chip from "./Chip.jsx";
import Error from "./Error.jsx";

function SelectFiles({ data, isLoading, setData, errors, setErrorState }) {
  useEffect(() => {
    setErrorState(false, "", "selectFile");
  }, [data.fileName]);

  async function handleSelectFile() {
    //returns object with filePath and fileName
    const response = await window.pythonApi.getFile();

    if (response !== undefined) {
      //loops through checking to see if file name already exists
      //throws an error if true
      for (let entry in data.fileName) {
        if (data.fileName[entry] === response.fileName) {
          setErrorState(true, "Error! File Names must be unique", "selectFile");
          return;
        }
      }

      setData((data) => ({
        ...data,
        fileName: [...data.fileName, response.fileName],
        filePath: [...data.filePath, response.filePath],
      }));

      setErrorState(false, "", "selectFile");
    }
  }

  return (
    <>
      <div>
        <label>Select File</label>
      </div>
      <div className={styles.selectFile}>
        <button
          className={styles.btn}
          id="file-in-btn"
          onClick={() => handleSelectFile()}
          disabled={isLoading}
        >
          Browse
        </button>
        <div className={styles.container}>
          <div
            className={styles.backgroundContainer}
            style={
              errors.selectFile.status === true
                ? { borderColor: "#c52f21" }
                : {}
            }
          >
            <div className={styles.chipsContainer}>
              {data.fileName.map((name) => (
                <Chip key={name} data={data} setData={setData}>
                  {name}
                </Chip>
              ))}
            </div>
          </div>
          {errors.selectFile.status && (
            <Error customStyle={{ marginTop: ".2rem" }}>
              {errors.selectFile.message}
            </Error>
          )}
        </div>
      </div>
    </>
  );
}

export default SelectFiles;
