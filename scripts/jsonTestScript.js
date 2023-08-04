console.log("Player Data\n------------");

function loadJSONAndOutput() {
  const xhr = new XMLHttpRequest();
  const playerData = "playerData.json";

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const jsonData = JSON.parse(xhr.responseText);
        console.log(jsonData);
      } else {
        console.error("Failed to load JSON file.");
      }
    }
  };

  xhr.open("GET", playerData, true);
  xhr.send();
}

//Testing json output in dev tools console
loadJSONAndOutput();
