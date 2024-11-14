import React from "react";
import FlextextConfig from "./FlextextConfig.jsx";
import ElanConfig from "./ElanConfig.jsx";
import styles from "./OutputFileConfig.module.css";
import { MdOutlineHelp } from "react-icons/md";

function OutputFileConfig({
  isOpen,
  onClose,
  data,
  setData,
  errors,
  setErrorState,
  includedLayerValues,
  setIncludedLayerValues,
  elanTemplateFileName,
  setElanTemplateFileName,
}) {
  //help info tooltip display text
  let helpTextInfo = "";

  function getDialogConfigTitle() {
    let dialogConfigTitle = "";

    if (data.outFileType === "flextext") {
      dialogConfigTitle = "Flextext";
      helpTextInfo = "Open Flextext Settings Help";
    } else if (data.outFileType === "elan") {
      dialogConfigTitle = "ELAN";
      helpTextInfo = "Open Elan Settings Help";
    }

    return dialogConfigTitle;
  }

  return (
    <dialog open={isOpen} className="modal-overlay">
      <article>
        <h2>{getDialogConfigTitle()} Configuration Settings</h2>{" "}
        <a data-tooltip={helpTextInfo} data-placement="bottom">
          <MdOutlineHelp
            className={styles.helpIcon}
            onClick={() => window.pythonApi.openHelpWindow("export")}
          />
        </a>
        <hr></hr>
        <section>
          {data.outFileType === "flextext" && (
            <FlextextConfig
              data={data}
              errors={errors}
              setErrorState={setErrorState}
              includedLayerValues={includedLayerValues}
              setIncludedLayerValues={setIncludedLayerValues}
            />
          )}
          {data.outFileType === "elan" && (
            <ElanConfig
              data={data}
              setData={setData}
              errors={errors}
              setErrorState={setErrorState}
              elanTemplateFileName={elanTemplateFileName}
              setElanTemplateFileName={setElanTemplateFileName}
            />
          )}
        </section>
        <footer>
          <button onClick={onClose}>Close</button>
        </footer>
      </article>
    </dialog>
  );
}

export default OutputFileConfig;
