import React from "react";
import styles from "./SelectTypes.module.css";

function SelectTypes({ data, setData, isLoading }) {
  return (
    <div className={styles.fileType}>
      <label>File input type</label>
      <select
        aria-label="Select File Type"
        name="inputType"
        onChange={(e) => handleSelectType(e)}
        disabled={isLoading}
      >
        <option defaultValue=""></option>
        <option value="flextext">Flextext</option>
        <option value="conllu">Conllu</option>
        <option value="nlp_pos">NLP</option>
      </select>
      {data.inFileType === "nlp_pos" && (
        <button
          className="nlp-button"
          disabled={isLoading}
          onClick={() => setNLPConfigOpen(!isNLPConfigOpen)}
        >
          NLP Settings
        </button>
      )}
    </div>
  );
}

export default SelectTypes;
