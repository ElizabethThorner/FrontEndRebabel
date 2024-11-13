import React, { useEffect, useState } from "react";
import styles from "./SelectFiles.module.css";
import Chip from "./Chip.jsx";
import Error from "./Error.jsx";

function SelectFiles({
  data,
  isLoading,
  setData,
  errors,
  setErrorState,
  fileTypeExtensions,
}) {
  const [isSelecting, setSelecting] = useState(false);
  const errorColor = "#FFBF00";

  useEffect(() => {
    setErrorState(false, "", "selectFile");
  }, [data.fileName]);

  async function handleSelectFile() {
    setSelecting(true);

    //returns object with filePath and fileName
    const response = await window.pythonApi.getFile(true);
    setSelecting(false);

    if (response !== undefined) {
      //loops through checking to see if file name already exists
      //throws an error if true
      for (let entry of data.fileName) {
        for (let name of response.fileName) {
          if (entry === name) {
            setErrorState(true, "File Names must be unique", "selectFile");
            return;
          }
        }
      }

      if (data.inFileType) {
        for (let path of response.filePath) {
          if (
            path.toString().split(".")[1] !==
            fileTypeExtensions[data.inFileType]
          ) {
            setErrorState(
              true,
              "File extension must match input type",
              "selectFile"
            );
            return;
          }
        }
      }

      setData((data) => ({
        ...data,
        fileName: [...data.fileName, ...response.fileName],
        filePath: [...data.filePath, ...response.filePath],
      }));

      setErrorState(false, "", "selectFile");
    }
  }

  function handleRemoveChip(nameOfChip) {
    //create copies of Paths for removal
    let pathCopies = [...data.filePath];

    let newFileName = data.fileName.filter((fileName, index) => {
      if (fileName !== nameOfChip) {
        return true;
      } else {
        //remove path from copies
        pathCopies.splice(index, 1);
        return false;
      }
    });

    setData((data) => ({
      ...data,
      filePath: [...pathCopies],
      fileName: [...newFileName],
    }));
  }

  return (
    <>
      <div>
        <label>Select File(s)</label>
      </div>
      <div className={styles.selectFile}>
        <button
          className={styles.btn}
          id="file-in-btn"
          onClick={() => handleSelectFile()}
          disabled={isLoading || isSelecting}
        >
          Browse
        </button>
        <div className={styles.container}>
          <div
            className={styles.backgroundContainer}
            style={
              errors.selectFile.status === true
                ? { borderColor: `${errorColor}` }
                : {}
            }
          >
            <div className={styles.chipsContainer}>
              {data.fileName.map((name) => (
                <Chip key={name} removeChip={() => handleRemoveChip(name)}>
                  {name}
                </Chip>
              ))}
            </div>
          </div>
          <Error customStyle={{ marginTop: ".2rem", color: `${errorColor}` }}>
            {errors.selectFile.message}
          </Error>
        </div>
      </div>
    </>
  );
}

export default SelectFiles;
