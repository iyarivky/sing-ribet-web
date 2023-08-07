var pasteConfig = function () {
  let def = SnackBar({
    message: "Successfully copied to clipboard.",
    position: "bc",
    fixed: true,
    status: "success"
  });
};

function parseUrl() {
    var inputText = document.getElementById("input").value;
    document.getElementById("output").value = inputText;
  }
