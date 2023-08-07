document.addEventListener("DOMContentLoaded", function() {
  // Constants
  const skinCount = 5;
  const player = JSON.parse(localStorage.getItem("playerData"));
  const textInput = document.getElementById('textInput');
  textInput.style.display = 'none';

  // Variables
  let currentSkinIndex = 0;
  let selectedSkinIndex = localStorage.getItem("selectedSkinIndex");
  let playerData = localStorage.getItem("playerData");
  let i = 0;


  // Register buttons
  const singleplayerBtn = document.querySelector(".singleplayerBtn");
  const multiplayerBtn = document.querySelector(".multiplayerBtn");
  const soundSelect = document.getElementById("soundSelect");
  const hideSelect = document.getElementById("hideNameSelect");
  const hintsSelect = document.getElementById("hintsSelect");
  const leftSelect = document.getElementById("leftArrow");
  const rightSelect = document.getElementById("rightArrow");
  const clearDataSelect = document.getElementById("deleteSave");
  const downloadDataSelect = document.getElementById("downloadSave");
  const changeNameSelect = document.getElementById("ChangeName");
  const abilitySelect = document.getElementById("changeAbilityBtn");

  // Event listeners
  singleplayerBtn.addEventListener("click", function() {
    console.log("Joined singleplayer");
    // Redirect to the singleplayer.html page when the button is clicked
    window.location.replace("../BattleOwls/html/singleplayer.html");
  });

  multiplayerBtn.addEventListener("click", function() {
    console.log("Joined multiplayer");
    // Redirect to the multiplayer.html page when the button is clicked
    // window.location.replace('../html/multiplayer.html');
  });

  soundSelect.addEventListener("click", function() {
    console.log("Changed sound (Enabled/Disabled)");
    // Get the current player data from localStorage
    const playerData = JSON.parse(localStorage.getItem("playerData"));
    // Update the sound option based on the checkbox status
    playerData.options[0].sound = soundSelect.checked;
    // Save the updated player data to localStorage
    updatePlayerData(playerData);
    //if (soundSelect.checked==true)
    //document.getElementById("soundId").muted = true; we need sound to test this
    //else
    //document.getElementById("soundId").muted = false;
  });

  hideSelect.addEventListener("click", function() {
    console.log("Changed names (Enabled/Disabled)");
    const playerData = JSON.parse(localStorage.getItem("playerData"));
    playerData.options[0].hideNames = hideSelect.checked;
    updatePlayerData(playerData);
    //if (hideSelect.checked==true)
    //document.getElementById("NameId") = ' '; we need nameplates to test this
    //else
    //document.getElementById("NameId") = ;
  });

  hintsSelect.addEventListener("click", function() {
    console.log("Changed hints (Enabled/Disabled)");
    const playerData = JSON.parse(localStorage.getItem("playerData"));
    playerData.options[0].enableHints = hintsSelect.checked;
    updatePlayerData(playerData);
  });

  rightSelect.addEventListener("click", function() {
    console.log("Next skin");
    currentSkinIndex = (currentSkinIndex + 1) % skinCount;
    skinSelection(currentSkinIndex);
  });

  leftSelect.addEventListener("click", function() {
    console.log("Previous skin");
    currentSkinIndex = (currentSkinIndex - 1 + skinCount) % skinCount;
    skinSelection(currentSkinIndex);
  });

  clearDataSelect.addEventListener("click", function() {
    console.log("Cleared player data");
    //Clear player data
    localStorage.removeItem("playerData");
  });

  downloadDataSelect.addEventListener("click", function() {
    console.log("Downloading player data to client");
    //Download Player Data
    downloadPlayerData();
  });

  changeNameSelect.addEventListener("click", function() {
    console.log("Changing Player Name");
    //Change Player Data
    textInput.style.display = 'block';
    const playerData = JSON.parse(localStorage.getItem("playerData"));
    textInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        const newName = textInput.value;
        playerData.playerName = newName;
        document.getElementById('playerName').innerHTML = playerData.playerName;
        updatePlayerData(playerData);
        textInput.style.display = 'none';
      }
    });
  });

  abilitySelect.addEventListener("click", function() {
    const playerData = JSON.parse(localStorage.getItem("playerData"));
    playerData.currentAbilityIndex += 1;
    i++;
    setAbility();
    updatePlayerData(playerData);
  });

  // Helper functions
  function setAbility() {
    const text = document.getElementById('abilityText');
    const playerData = JSON.parse(localStorage.getItem("playerData"));
    if (i > 3) {
      playerData.currentAbilityIndex -= 4;
      i = 0;
    }
    if (i == 0) {
      text.innerHTML = "Speed Boost: <br> Increases speed and egg gain by 4* (Faster Games)"
    }
    else if (i == 1) {
      text.innerHTML = "Slow Time: <br> 3 uses lowers speed by 4* and removes egg gain (Safety)"
    }
    else if (i == 2) {
      text.innerHTML = "Ghost: <br> Removes all collisions but lowers egg gain (Slower Games)"
    }
    else if (i == 3) {
      text.innerHTML = "Bomb: <br> Resets worms and obstacles on the map at the cost of one egg (Safety)"
    }
  }

  function loadPreviousData() {
    if (playerData) {
      const jsonData = JSON.parse(playerData);
      currentSkinIndex = jsonData.currentSkinIndex || 0;
      console.log("Player data exists:", playerData);
      skinSelection(currentSkinIndex);
    } else {
      console.log("Player data does not exist!");
      skinSelection(0);
    }
  }

  function downloadPlayerData() {
    const jsonData = JSON.parse(localStorage.getItem("playerData"));
    const dataStr = JSON.stringify(jsonData, null, 2); // Pretty-print with 2 spaces indentation
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUri;
    downloadLink.download = "playerData.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  function updatePlayerData(data) {
    try {
      localStorage.setItem("playerData", JSON.stringify(data));
      console.log("Player data updated successfully.");
    } catch (error) {
      console.error("Failed to update player data.", error);
    }
  }

  function skinSelection(index) {
    const xhr = new XMLHttpRequest();
    const playerData = "playerData.json";

    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        // If data can be loaded execute
        if (xhr.status === 200) {
          const jsonData = JSON.parse(xhr.responseText);
          const cosmetics = jsonData.cosmetics[0];
          const skinKeys = Object.keys(cosmetics);
          const selectedSkin = cosmetics[skinKeys[index]];

          // Check if the selected skin is unlocked
          if (selectedSkin.unlocked) {
            // Update playerData with the new currentSkinIndex
            jsonData.currentSkinIndex = index;

            localStorage.setItem("selectedSkinIndex", index);
            localStorage.setItem("playerData", JSON.stringify(jsonData));
          }

          // Set Skin name based on the selected skin index
          skinName.textContent = selectedSkin.name;

          const selectedSkinImage = document.getElementById("selectedSkin");

          if (index === 0) {
            selectedSkinImage.src = "assets/owls/Owl.png";
          } else if (index >= 1 && index <= 4) {
            selectedSkinImage.src = `assets/owls/Owl_${selectedSkin.name}.png`;
          } else {
            // Handle any other cases here, or show a default image
            selectedSkinImage.src = "assets/owls/default.png";
          }

          const unlockStatusElement = document.getElementById("unlockStatus");
          if (selectedSkin.unlocked) {
            unlockStatusElement.textContent = "Unlocked";
          } else {
            unlockStatusElement.textContent = "Locked";
          }

          selectedSkinImage.alt = selectedSkin.name;
        }
        // If data cannot be loaded
        else {
          console.error("Failed to load JSON file.");
        }
      }
    };

    xhr.open("GET", playerData, true);
    xhr.send();
  }

  // Update highscore, playername, xp, level, options
  // based on playerData.json
  function updateMenuData() {
    const xhr = new XMLHttpRequest();
    const playerData = "playerData.json";

    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        //If data can be loaded execute
        if (xhr.status === 200) {
          const jsonData = JSON.parse(xhr.responseText);
          console.log(jsonData);

          //Set Highscore value
          highScoreValue.textContent = `${jsonData.highScore}`;
          //Set Player name
          playerName.textContent = `${jsonData.playerName}`;
          //Set XP bar text
          XPText.textContent = `${jsonData.currentXP}` + "/10";

          document.getElementById('Bar').style.width = `${jsonData.currentXP}` * 10 + "%";

          // Update options checkboxes based on playerData
          soundSelect.checked = jsonData.options[0].sound;
          hideSelect.checked = jsonData.options[0].hideNames;
          hintsSelect.checked = jsonData.options[0].enableHints;
        }
        //If data cannot be loaded
        else {
          console.error("Failed to load JSON file.");
        }
      }
    };

    xhr.open("GET", playerData, true);
    xhr.send();
    skinSelection(currentSkinIndex);
  }

  function updateChallenges(){
    const xhr2 = new XMLHttpRequest();
    const challengeList = "challenges.json";

    xhr2.onreadystatechange = function() {
      if (xhr2.readyState === XMLHttpRequest.DONE) {
        //If data can be loaded execute
        if (xhr2.status === 200) {
          const jsonData = JSON.parse(xhr2.responseText);
          weeklyChallenge.textContent = `${jsonData.weeklyChallenge.wChallenge1.name}`;
          dailyChallenge.textContent = `${jsonData.dailyChallenge.dChallenge2.name}`
        }
        //If data cannot be loaded
        else {
          console.error("Failed to load JSON file.");
        }
      }
    };

    xhr2.open("GET", challengeList, true);
    xhr2.send();
  }

  // Initializations
  if (selectedSkinIndex !== null) {
    skinSelection(parseInt(selectedSkinIndex, 10));
  } else {
    skinSelection(0);
  }

  loadPreviousData();
  updateMenuData();
  updateChallenges();
  setAbility();
});
