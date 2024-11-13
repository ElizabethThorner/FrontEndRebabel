import React, { useState } from "react";
import Error from "../Error.jsx";
import styles from "./Mappings.module.css";
import MappingsTable from "./MappingsTable.jsx";
import { MdOutlineHelp } from "react-icons/md";

function Mappings({ isOpen, onClose, data, setData, errors, setErrorState }) {
  const [isAddTypeMappingOpen, setAddTypeMappingOpen] = useState(false);
  const [isAddFeatureMappingOpen, setAddFeatureMappingOpen] = useState(false);
  const [inType, setInType] = useState("");
  const [outType, setOutType] = useState("");
  const [inFeature, setInFeature] = useState("");
  const [outFeature, setOutFeature] = useState("");

  const typeMappings = data.mappings[0];
  const featureMappings = data.mappings[1];

  function handleInputChanges(e) {
    if (e.target.name === "in_type") {
      setInType(e.target.value);
      setErrorState(false, "", "inType");
    } else if (e.target.name === "out_type") {
      setOutType(e.target.value);
      setErrorState(false, "", "outType");
    } else if (e.target.name === "in_feature") {
      setInFeature(e.target.value);
      setErrorState(false, "", "inFeature");
    } else {
      setOutFeature(e.target.value);
      setErrorState(false, "", "outFeature");
    }
  }

  function handleRemoveMapping(mappingTypeIndex, mappingIndex) {
    const newMappings = data.mappings[mappingTypeIndex].filter(
      (_, i) => i !== mappingIndex
    );
    data.mappings[mappingTypeIndex] = newMappings;
    if (!data.mappings[0].length && !data.mappings[1].length) {
      setErrorState(true, "Mappings must be provided", "mappings");
    }
    setData((data) => ({ ...data }));
  }

  function resetDialog(mappingTypeIndex, isSubmit) {
    if (isSubmit) {
      setErrorState(false, "", "mappings");
    }

    if (mappingTypeIndex) {
      setAddFeatureMappingOpen(false);
      setInFeature("");
      setOutFeature("");
      setErrorState(false, "", "inFeature");
      setErrorState(false, "", "outFeature");
    } else {
      setAddTypeMappingOpen(false);
      setInType("");
      setOutType("");
      setErrorState(false, "", "inType");
      setErrorState(false, "", "outType");
    }
  }

  function handleSubmitTypes() {
    let errorOccurred = false;
    if (inType.search(/^\s*$/g) !== -1) {
      setErrorState(true, "Cannot be empty", "inType", true);
      errorOccurred = true;
    } else if (inType.search(/\s/g) !== -1) {
      setErrorState(true, "Cannot contain spaces", "inType", true);
      errorOccurred = true;
    }

    if (outType.search(/^\s*$/g) !== -1) {
      setErrorState(true, "Cannot be empty", "outType", true);
      errorOccurred = true;
    } else if (outType.search(/\s/g) !== -1) {
      setErrorState(true, "Cannot contain spaces", "outType", true);
      errorOccurred = true;
    }

    if (!errorOccurred) {
      resetDialog(0, true);
      data.mappings[0].push({ in_type: inType, out_type: outType });
    }
  }

  function handleSubmitFeatures() {
    let errorOccurred = false;
    if (inFeature.search(/^\s*$/g) !== -1) {
      setErrorState(true, "Cannot be empty", "inFeature", true);
      errorOccurred = true;
    } else if (inFeature.search(/\s/g) !== -1) {
      setErrorState(true, "Cannot contain spaces", "inFeature", true);
      errorOccurred = true;
    }

    if (outFeature.search(/^\s*$/g) !== -1) {
      setErrorState(true, "Cannot be empty", "outFeature", true);
      errorOccurred = true;
    } else if (outFeature.search(/\s/g) !== -1) {
      setErrorState(true, "Cannot contain spaces", "outFeature", true);
      errorOccurred = true;
    }

    if (!errorOccurred) {
      data.mappings[1].push({
        in_feature: inFeature,
        out_feature: outFeature,
      });
      resetDialog(1, true);
    }
  }

  const typeDialog = (
    <dialog open={isAddTypeMappingOpen}>
      <article>
        <h2>Type Mapping</h2>
        <hr></hr>
        <div className={styles.inputsContainer}>
          <div className={styles.input}>
            <label>In Type</label>
            <input
              name="in_type"
              type="text"
              value={inType}
              onChange={(e) => handleInputChanges(e)}
              aria-label="In type settings"
              {...errors.inType.ariaProps}
            />
            <Error>{errors.inType.message}</Error>
          </div>
          <div className={styles.input}>
            <label>Out Type</label>
            <input
              name="out_type"
              type="text"
              value={outType}
              onChange={(e) => handleInputChanges(e)}
              aria-label="Out type settings"
              {...errors.outType.ariaProps}
            />
            <Error>{errors.outType.message}</Error>
          </div>
        </div>
        <footer>
          <button onClick={() => handleSubmitTypes()}>Submit</button>
          <button onClick={() => resetDialog(0, false)}>Cancel</button>
        </footer>
      </article>
    </dialog>
  );

  const featureDialog = (
    <dialog open={isAddFeatureMappingOpen}>
      <article>
        <h2>Feature Mapping</h2>
        <hr></hr>
        <div className={styles.inputsContainer}>
          <div className={styles.input}>
            <label>In Feature</label>
            <input
              name="in_feature"
              type="text"
              value={inFeature}
              onChange={(e) => handleInputChanges(e)}
              aria-label="In feature settings"
              {...errors.inFeature.ariaProps}
            />
            <Error>{errors.inFeature.message}</Error>
          </div>
          <div className={styles.input}>
            <label>Out Feature</label>
            <input
              name="out_feature"
              type="text"
              value={outFeature}
              onChange={(e) => handleInputChanges(e)}
              aria-label="Out feature settings"
              {...errors.outFeature.ariaProps}
            />
            <Error>{errors.outFeature.message}</Error>
          </div>
        </div>
        <footer>
          <button onClick={() => handleSubmitFeatures()}>Submit</button>
          <button onClick={() => resetDialog(1, false)}>Cancel</button>
        </footer>
      </article>
    </dialog>
  );

  return (
    <dialog open={isOpen} className="modal-overlay">
      <article>
        <h2>Mappings</h2>
        <a data-tooltip="Open Mappings Help" data-placement="right">
          <MdOutlineHelp className={styles.helpIcon} />
        </a>
        <hr></hr>
        <section>
          {errors.mappings.status && (
            <p className={`${styles.emptyValue} ${styles.error}`}>
              Mappings cannot be empty
            </p>
          )}
          <div>
            <label className={styles.headingLabel}>Type Mappings:</label>
            {typeMappings.length === 0 && (
              <p className={styles.emptyValue}>
                No Current Type Mappings to Display
              </p>
            )}
            {typeMappings.length > 0 && (
              <MappingsTable
                mode="type"
                handleRemoveMapping={handleRemoveMapping}
                mappingData={typeMappings}
              />
            )}
            <label className={styles.headingLabel}>Feature Mappings:</label>
            {featureMappings.length === 0 && (
              <p className={styles.emptyValue}>
                No Current Feature Mappings to Display
              </p>
            )}
            {featureMappings.length > 0 && (
              <MappingsTable
                mode="feature"
                handleRemoveMapping={handleRemoveMapping}
                mappingData={featureMappings}
              />
            )}
          </div>
          <div className={styles.mappingsContainer}>
            <div>
              <button onClick={() => setAddTypeMappingOpen(true)}>
                Add New Type Mapping
              </button>
              {typeDialog}
            </div>
            <div>
              <button onClick={() => setAddFeatureMappingOpen(true)}>
                Add New Feature Mapping
              </button>
              {featureDialog}
            </div>
          </div>
        </section>
        <footer>
          <button onClick={onClose}>Close</button>
        </footer>
      </article>
    </dialog>
  );
}

export default Mappings;
