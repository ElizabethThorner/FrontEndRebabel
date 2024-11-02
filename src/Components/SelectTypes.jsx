import React from "react";
import styles from "./SelectTypes.module.css";
import Error from "./Error.jsx";

// name - value appears in html select
// rebabelCode - value that rebabel uses for import or export
// operations - import, export or both.
const dataFormats = [
  {
    name: "Flextext",
    rebabelCode: "flextext",
    operations: "both"
  },
  {
    name: "Conllu",
    rebabelCode: "conllu",
    operations: "both"
  },
  {
    name: "NLP",
    rebabelCode: "nlp_pos",
    operations: "import"
  },
  {
    name: "ELAN",
    rebabelCode: "elan",
    operations: "import"
  },
  {
    name: "Macula",
    rebabelCode: "macula-node",
    operations: "import"
  },
  {
    name: "SFM",
    rebabelCode: "sfm",
    operations: "import"
  }
];

function SelectTypes({
  label,
  selectConfig,
  data,
  setData,
  errors,
  setErrorState,
  isLoading,
  setNLPConfigOpen = undefined,
  setOutputFileConfigOpen = undefined,
}) {
  const errorColor = "#FFBF00";

  function handleInputType(e) {
    setData((data) => ({ ...data, inFileType: e.target.value }));

    if (e.target.value === "") {
      setErrorState(true, "Type cannot be empty", "inFileType", true);
      return;
    }

    if (e.target.value === "nlp_pos") {
      setNLPConfigOpen(true);
    }

    setErrorState(false, "", "inFileType");
  }

  function handleOutputType(e) {
    setData((data) => ({ ...data, outFileType: e.target.value }));

    if (e.target.value === "") {
      setErrorState(true, "Type cannot be empty", "outFileType", true);
      return;
    }

    setErrorState(false, "", "outFileType");
  }

  return (
    <div className={styles.fileType}>
      <label>{label}</label>
      <div className={styles.inputButtonContainer}>
        <div className={styles.selectContainer}>
          <select
            aria-label="Select File Type"
            name={selectConfig}
            onChange={
              selectConfig === "inputType"
                ? (e) => handleInputType(e)
                : (e) => handleOutputType(e)
            }
            value={
              selectConfig === "inputType" ? data.inFileType : data.outFileType
            }
            disabled={isLoading}
            {...(selectConfig === "inputType"
              ? errors.inFileType.ariaProps
              : errors.outFileType.ariaProps)}
          >
            <option defaultValue=""></option>
            {dataFormats.map((item) => {
              //Import
              if (
                selectConfig === "inputType" &&
                item.operations !== "export" &&
                item.rebabelCode !== data.outFileType
              ) {
                return (
                  <option value={item.rebabelCode} key={item.rebabelCode}>
                    {item.name}
                  </option>
                );
              } else if (
                //Export
                selectConfig === "outputType" &&
                item.operations !== "import" &&
                item.rebabelCode !== data.inFileType
              ) {
                return (
                  <option value={item.rebabelCode} key={item.rebabelCode}>
                    {item.name}
                  </option>
                );
              }
            })}
          </select>
          <Error customStyle={{ color: `${errorColor}` }}>
            {selectConfig === "inputType"
              ? errors.inFileType.message
              : errors.outFileType.message}
          </Error>
        </div>
        {selectConfig === "inputType" && data.inFileType === "nlp_pos" && (
          <button
            className={styles.nlpButton}
            disabled={isLoading}
            onClick={() => setNLPConfigOpen(true)}
          >
            NLP Settings
          </button>
        )}
        {selectConfig === "outputType" && data.outFileType === "flextext" && (
          <button
            className={styles.outputButton}
            disabled={isLoading}
            onClick={() => setOutputFileConfigOpen(true)}
          >
            Output File Settings
          </button>
        )}
      </div>
    </div>
  );
}

export default SelectTypes;
