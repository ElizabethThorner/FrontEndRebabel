// Fetch the version and display it in the HTML
window.pythonApi.getAppVersion().then(version => {
    document.getElementById("version").innerText = version;
  });