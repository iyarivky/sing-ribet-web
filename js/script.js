var pasteConfig = function(outputId) {
	let def = SnackBar({
		message: "Successfully copied to clipboard.",
		position: "bc",
		fixed: true,
		status: "success"
	});
	var copyText = document.getElementById(outputId);
	// Select the text field
	copyText.select();
	copyText.setSelectionRange(0, 99999); // For mobile devices
	// Copy the text inside the text field
	navigator.clipboard.writeText(copyText.value);
};

//parseUrl button
function parseUrl() {
	var inputText = document.getElementById("input").value;
	document.getElementById("output-1").value = inputText;
	document.getElementById("output-2").value = inputText;
	document.getElementById("output-3").value = inputText;
	document.getElementById("output-4").value = inputText;
}
