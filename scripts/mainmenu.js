document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const skinCount = 5;
  
    // Variables
    let currentSkinIndex = 0;
    let selectedSkinIndex = localStorage.getItem('selectedSkinIndex');
    let playerData = localStorage.getItem('playerData');
  
    // Register buttons
    const singleplayerBtn = document.querySelector('.singleplayerBtn');
    const multiplayerBtn = document.querySelector('.multiplayerBtn');
    const soundSelect = document.getElementById('soundSelect');
    const hideSelect = document.getElementById('hideNameSelect');
    const hintsSelect = document.getElementById('hintsSelect');
    const leftSelect = document.getElementById('leftArrow');
    const rightSelect = document.getElementById('rightArrow');
    const clearDataSelect = document.getElementById('deleteSave');
    const downloadDataSelect = document.getElementById('downloadSave');
  
    // Event listeners
    singleplayerBtn.addEventListener('click', function() {
      console.log('Joined singleplayer')
      // Redirect to the singleplayer.html page when the button is clicked
      window.location.href = '../html/singleplayer.html';
    });
  
    multiplayerBtn.addEventListener('click', function() {
      console.log('Joined multiplayer')
      // Redirect to the multiplayer.html page when the button is clicked
      window.location.href = '../html/multiplayer.html';
    });
  
    soundSelect.addEventListener('click', function() {
      console.log("Changed sound (Enabled/Disabled)");
      // Get the current player data from localStorage
      const playerData = JSON.parse(localStorage.getItem('playerData'));
      // Update the sound option based on the checkbox status
      playerData.options[0].sound = soundSelect.checked;
      // Save the updated player data to localStorage
      updatePlayerData(playerData);
    });
  
    hideSelect.addEventListener('click', function() {
      console.log("Changed names (Enabled/Disabled)");
      const playerData = JSON.parse(localStorage.getItem('playerData'));
      playerData.options[0].hideNames = hideSelect.checked;
      updatePlayerData(playerData);
    });
  
    hintsSelect.addEventListener('click', function() {
      console.log("Changed hints (Enabled/Disabled)");
      const playerData = JSON.parse(localStorage.getItem('playerData'));
      playerData.options[0].enableHints = hintsSelect.checked;
      updatePlayerData(playerData);
    });
  
    rightSelect.addEventListener('click', function() {
      console.log("Next skin");
      currentSkinIndex = (currentSkinIndex + 1) % skinCount;
      skinSelection(currentSkinIndex);
    });
  
    leftSelect.addEventListener('click', function() {
      console.log("Previous skin");
      currentSkinIndex = (currentSkinIndex - 1 + skinCount) % skinCount;
      skinSelection(currentSkinIndex);
    });

    clearDataSelect.addEventListener('click', function(){
      console.log('Cleared player data')
      //Clear player data
      localStorage.removeItem('playerData');
    });

    downloadDataSelect.addEventListener('click', function(){
      console.log('Downloading player data to client')
      //Donload Player Data
      downloadPlayerData();
    });
  
    // Helper functions
    function loadPreviousData() {
      if (playerData) {
        const jsonData = JSON.parse(playerData);
        currentSkinIndex = jsonData.currentSkinIndex || 0;
        console.log('Player data exists:', playerData);
        skinSelection(currentSkinIndex);

      } else {
        console.log('Player data does not exist!');
        skinSelection(0);
      }
    }
    function downloadPlayerData() {
        const jsonData = JSON.parse(localStorage.getItem('playerData'));
        const dataStr = JSON.stringify(jsonData, null, 2); // Pretty-print with 2 spaces indentation
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUri;
        downloadLink.download = 'playerData.json';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    function updatePlayerData(data) {
      try {
        localStorage.setItem('playerData', JSON.stringify(data));
        console.log('Player data updated successfully.');
      } catch (error) {
        console.error('Failed to update player data.', error);
      }
    }
    
    
    function skinSelection(index) {
        const xhr = new XMLHttpRequest();
        const playerData = 'playerData.json';

        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                // If data can be loaded execute
                if (xhr.status === 200) {
                    const jsonData = JSON.parse(xhr.responseText);
                    const cosmetics = jsonData.cosmetics[0];
                    const skinKeys = Object.keys(cosmetics);
                    const selectedSkin = cosmetics[skinKeys[index]];

                    // Set Skin name based on the selected skin index
                    skinName.textContent = selectedSkin.name;

                    // Update playerData with the new currentSkinIndex
                    jsonData.currentSkinIndex = index;

                    localStorage.setItem('selectedSkinIndex', index);

                    localStorage.setItem('playerData', JSON.stringify(jsonData));
                
                  const selectedSkinImage = document.getElementById('selectedSkin');
                  if (index === 0) {
                    selectedSkinImage.src = 'assets/owls/Owl.png';
                  } 
                  else if (index >= 1 && index <= 4) {
                    selectedSkinImage.src = `assets/owls/Owl_${selectedSkin.name}.png`;
                  } 
                  else {
                    // Handle any other cases here, or show a default image
                    selectedSkinImage.src = 'assets/owls/default.png';
                  }

                  const unlockStatusElement = document.getElementById('unlockStatus');
                  if (selectedSkin.unlocked) {
                    unlockStatusElement.textContent = 'Unlocked';
                  } 
                  else {
                    unlockStatusElement.textContent = 'Locked';
                  }

                  selectedSkinImage.alt = selectedSkin.name;
                }
                // If data cannot be loaded
                else {
                    console.error('Failed to load JSON file.');
                }
            }
        };

        xhr.open('GET', playerData, true);
        xhr.send();
    }

    // Update highscore, playername, xp, level, options
    // based on playerData.json
    function updateMenuData() {
        const xhr = new XMLHttpRequest();
        const playerData = 'playerData.json';

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

                    // Update options checkboxes based on playerData
                    soundSelect.checked = jsonData.options[0].sound;
                    hideSelect.checked = jsonData.options[0].hideNames;
                    hintsSelect.checked = jsonData.options[0].enableHints;

                }
                //If data cannot be loaded
                else {
                    console.error('Failed to load JSON file.');
                }
            }
        };

        xhr.open('GET', playerData, true);
        xhr.send();
        skinSelection(currentSkinIndex);
    }

    // Initializations
    if (selectedSkinIndex !== null) {
        skinSelection(parseInt(selectedSkinIndex, 10));
    } else {
        skinSelection(0);
    }


    loadPreviousData();
    updateMenuData();
});