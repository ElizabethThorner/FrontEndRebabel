import React from "react";
import styles from "./SelectTypes.module.css";

const dataFormats = [
  {
    name: "Flextext",
    rebabelCode: "flextext",
    operations: "both",
  },
  {
    name: "Conllu",
    rebabelCode: "conllu",
    operations: "import",
  },
  {
    name: "NLP",
    rebabelCode: "nlp_pos",
    operations: "import",
  },
];

function SelectTypes({
  label,
  selectConfig,
  data,
  setData,
  isLoading,
  setNLPConfigOpen = undefined,
  setOutputFileConfigOpen = undefined,
}) {
  function handleInputType(e) {
    setData((data) => ({ ...data, inFileType: e.target.value }));

    if (e.target.value === "nlp_pos") {
      setNLPConfigOpen(true);
    }
  }

  function handleOutputType(e) {
    setData((data) => ({ ...data, outFileType: e.target.value }));
  }
  return (
    <div className={styles.fileType}>
      <label>{label}</label>
      <select
        aria-label="Select File Type"
        name={selectConfig}
        onChange={
          selectConfig === "inputType"
            ? (e) => handleInputType(e)
            : (e) => handleOutputType(e)
        }
        disabled={isLoading}
      >
        <option defaultValue=""></option>
        {dataFormats.map((item) => {
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
  );
}

export default SelectTypes;
