import React from "react";
import Select from "react-select";
import Error from "../Error.jsx";

function FlextextConfig({
  data,
  errors,
  setErrorState,
  includedLayerValues,
  setIncludedLayerValues,
}) {
  const flextextOptions = [
    { value: "interlinear-text", label: "interlinear-text" },
    { value: "paragraph", label: "paragraph" },
    { value: "phrase", label: "phrase" },
    { value: "word", label: "word" },
    { value: "morph", label: "morpheme" },
  ];

  function handleFlextextOptionChange(layers) {
    const sortedLayers =
      layers.length > 0
        ? layers.toSorted(
            (a, b) =>
              flextextOptions.findIndex((opt) => opt.value === a.value) -
              flextextOptions.findIndex((opt) => opt.value === b.value)
          )
        : [];

    if (sortedLayers.length > 0) {
      const rootIndex = flextextOptions.findIndex(
        (opt) => opt.value === sortedLayers[0].value
      );
      const allLayersBelowRoot = flextextOptions.filter(
        (opt1) => flextextOptions.findIndex((opt2) => opt2 === opt1) > rootIndex
      );
      const skippedLayers = allLayersBelowRoot.filter(
        (layer) => !sortedLayers.some((selected) => selected.value === layer.value)
      );

      data.additionalArguments.root = sortedLayers[0].value;
      data.additionalArguments.skip = skippedLayers.map((layer) => layer.value);

      setErrorState(false, "", "skipRoot");
    } else {
      data.additionalArguments.root = "";
      data.additionalArguments.skip = [];
      setErrorState(true, "At least one layer must be selected", "skipRoot");
    }

    setIncludedLayerValues(layers.map((layer) => layer.value));
  }
  return (
    <div>
      <label>
        Include all layers that will be non-empty in the resulting flextext
        file. By default, only "phrase" and "word" are included.
      </label>
      <Select
        defaultValue={includedLayerValues.map((value) =>
          flextextOptions.find((option) => option.value === value)
        )}
        maxMenuHeight={80}
        isMulti
        name="includedLayers"
        options={flextextOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        isSearchable={false}
        onChange={(layers) => handleFlextextOptionChange(layers)}
        aria-label="flextext settings"
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: errors.skipRoot.status ? "#c52f21" : "grey",
          }),
        }}
      />
      <Error>{errors.skipRoot.message}</Error>
    </div>
  );
}

export default FlextextConfig;
