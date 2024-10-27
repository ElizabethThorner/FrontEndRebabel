import React from "react";
import Select from 'react-select';

function OutputFileConfig({ isOpen, onClose, data, setData, 
  includedLayerValues, setIncludedLayerValues }) {

  const flextextOptions = [
    { value : 'interlinear-text', label: 'interlinear-text' },
    { value : 'paragraph', label: 'paragraph' },
    { value : 'phrase', label: 'phrase' },
    { value : 'word', label: 'word' },
    { value : 'morph', label: 'morpheme' }
  ]

  function handleFlextextOptionChange(layers) {
    const sortedLayers = layers.length > 0
    ? layers.toSorted(
        (a, b) => flextextOptions.findIndex(opt => opt.value === a.value) - flextextOptions.findIndex(opt => opt.value === b.value)
      )
    : [];

    if (sortedLayers.length > 0) {
      const rootIndex = flextextOptions.findIndex(opt => opt.value === sortedLayers[0].value);
      const allLayersBelowRoot = flextextOptions.filter(opt1 => 
        (flextextOptions.findIndex(opt2 => opt2 === opt1) > rootIndex)
      );
      const skippedLayers = allLayersBelowRoot.filter(layer => !sortedLayers.includes(layer));

      setData((data) => ({ ...data, root: sortedLayers[0].value}));
      setData((data) => ({ ...data, skip: skippedLayers.map(layer => layer.value)}));
    } else {
      setData((data) => ({ ...data, root: ""}));
      setData((data) => ({ ...data, skip: []}));
    }

    setIncludedLayerValues(layers.map(layer => layer.value))
  }

  return (
    <dialog open={isOpen} className="modal-overlay">
      <article>
        <h2>{data.outFileType} Configuration Settings</h2>
        <hr></hr>
        <section>
        {data.outFileType === "flextext" && 
          <div>
            <label>Include all layers that will be non-empty in the resulting flextext file. By default, only "phrase" and "word" are included.</label>
            <Select
              defaultValue={includedLayerValues.map(value => flextextOptions.find(option => option.value === value))}             
              maxMenuHeight={80}
              isMulti
              name="includedLayers"
              options={flextextOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              isSearchable={false}
              onChange={(layers) => handleFlextextOptionChange(layers)}
              aria-label="flextext settings"
            />
          </div>
          }
        </section>
        <footer>
          <button onClick={onClose}>Close</button>
        </footer>
      </article>
    </dialog>
  );
}

export default OutputFileConfig;