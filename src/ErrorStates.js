const errorStates = {
  selectFile: {
    status: false,
    message: "",
  },
  inFileType: {
    status: false,
    message: "",
    ariaProps: { "aria-invalid": undefined },
  },
  outFileType: {
    status: false,
    message: "",
    ariaProps: { "aria-invalid": undefined },
  },
  nlpFileType: {
    status: false,
    message: "",
    ariaProps: { "aria-invalid": undefined },
  },
  nlpDelimiter: {
    status: false,
    message: "",
    ariaProps: { "aria-invalid": undefined },
  },
  partOfSpeechFile: {
    status: false,
    message: "",
    ariaProps: { "aria-invalid": undefined },
  },
  languageFile: {
    status: false,
    message: "",
    ariaProps: { "aria-invalid": undefined },
  },
  skipRoot: {
    status: false,
    message: "",
  },
  mappings: {
    status: false,
    message: ""
  }
};

export default errorStates;
