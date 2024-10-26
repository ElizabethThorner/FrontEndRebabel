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
};

export default errorStates;
