document.addEventListener("DOMContentLoaded", (event) => {
  const player = document.getElementById("player");
  const worm = document.getElementById("worm");
  const egg = document.getElementById("egg");
  const obstacle = document.getElementById("landmine");
  const spike = document.getElementById("spikes");
  const bombO = document.getElementById("owlbomb");
  const restartBtn = document.getElementById("restartBtn");
  const quitBtn = document.getElementById("quitBtn");
  const abilityIcon = document.getElementById("ability");
  const restartPBtn = document.getElementById("restartPBtn");
  const quitPBtn = document.getElementById("quitPBtn");
  const resumeBtn = document.getElementById("resumeBtn");
  const startBtn = document.getElementById("startBtn");
  const playerData = JSON.parse(localStorage.getItem("playerData"));
  if (playerData.options[0].hideNames==false)
  document.getElementById('playerID').innerHTML = playerData.playerName;

  let direction = "";
  let speedMultiplier = 0.25;
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let x = vw / 2;
  let y = vh / 2;
  let moveDistance = 2;
  let eggCount = 0;
  let wormCount = 0;
  let AccelerateAbility = false;
  let SlowTime = false;
  let Ghost = false;
  let Bomb = false;
  let i = 0;
  let eggs = [];
  let C = 0;
  let t = 0;
  let h = 0;
  let e = 0;
  let selectedSkinIndex = localStorage.getItem("selectedSkinIndex");
  let hintCheck = playerData.options[0].enableHints;
  let EXP = 0;
  let deathRepeat = false;
  let OisSpawn = false;
  let SisSpawn = false;
  let BisSpawn = false;
  let WisSpawn = false;

  if (hintCheck == true) {
    moveDistance = 0;
    hintOverlayOn();
  }
  else {
    hintOverlayOff();
  }

  if (playerData.currentAbilityIndex == 0) {
    abilityIcon.querySelector("img").src = "../assets/Speed Boost.png";
    AccelerateAbility = true;
  }
  else if (playerData.currentAbilityIndex == 1) {
    abilityIcon.querySelector("img").src = "../assets/Slow Time 3.png";
    SlowTime = true;
  }
  else if (playerData.currentAbilityIndex == 2) {
    abilityIcon.querySelector("img").src = "../assets/Ghost.png";
    Ghost = true;
  }
  else if (playerData.currentAbilityIndex == 3) {
    abilityIcon.querySelector("img").src = "../assets/Bomb.png";
    Bomb = true;
  }
  else abilityIcon.querySelector("img").src = "../assets/Blank.png";

  // Game functions
  function movePlayer() {
    switch (direction) {
      case "up":
        y -= moveDistance;
        break;
      case "left":
        x -= moveDistance;
        break;
      case "down":
        y += moveDistance;
        break;
      case "right":
        x += moveDistance;
        break;
    }
    player.style.left = x + "px";
    player.style.top = y + "px";
   

    if (direction == "down") {
      egg.style.left = x + 20 + "px";
      egg.style.top = y - 90 + "px";
    } else if (direction == "right") {
      egg.style.left = x - 70 + "px";
      egg.style.top = y + 50 + "px";
    } else if (direction == "up") {
      egg.style.left = x + 22.5 + "px";
      egg.style.top = y + 165 + "px";
    } else {
      egg.style.left = x + 110 + "px";
      egg.style.top = y + 50 + "px";
    }
  }

  restartBtn.addEventListener("click", function() {
    console.log("Joined singleplayer");
    // Redirect to the singleplayer.html page when the button is clicked
    window.location.replace("singleplayer.html");
  });
  quitBtn.addEventListener("click", function() {
    console.log("QUIT");
    // Redirect to mainmenu.html page when the button is clicked
    window.location.replace("/BattleOwls");
  });

  restartPBtn.addEventListener("click", function() {
    console.log("Joined singleplayer");
    // Redirect to the singleplayer.html page when the button is clicked
    window.location.replace("singleplayer.html");
  });

  quitPBtn.addEventListener("click", function() {
    console.log("QUIT");
    // Redirect to mainmenu.html page when the button is clicked
    window.location.replace("/BattleOwls");
  });

  resumeBtn.addEventListener("click", function() {
    console.log("RESUME");
    // Remove overlay and resume game when clicked
    pauseOverlayOff();
    moveDistance = h;
  });

  startBtn.addEventListener("click", function() {
    console.log("Start");
    // Remove overlay and start game when clicked
    hintOverlayOff();
    moveDistance = 2;
  });

  function pauseOverlayOn() {
    document.getElementById("pauseMenu").style.display = "flex";
  }

  function pauseOverlayOff() {
    document.getElementById("pauseMenu").style.display = "none";
  }

  function gamerOverOverlayOn() {
    EXP = eggCount / 12;
    XP = Math.floor(EXP);
    if (eggCount > playerData.highScore) {
      playerData.highScore = eggCount;
      document.getElementById('textHighScore').innerHTML = "You broke your High Score! <br> <br> New High Score: " + eggCount;
      localStorage.setItem("highScore", eggCount);
    }
    if (XP > 0) {
      playerData.currentXP += XP;
      document.getElementById('textXP').innerHTML = "You have gained " + XP + " exp!";
    }
    if (playerData.currentXP >= 10) {
      playerData.currentLevel += 1;
      playerData.currentXP -= 10;
      document.getElementById('textLevel').innerHTML = 'You Leveled Up!';
    }
    document.getElementById("gameOverMenu").style.display = "flex";
  }

  function gamerOverOverlayOff() {
    document.getElementById("gameOverMenu").style.display = "none";
  }

  function hintOverlayOn() {
    document.getElementById("hintMenu").style.display = "flex";
  }

  function hintOverlayOff() {
    document.getElementById("hintMenu").style.display = "none";
  }

  document.addEventListener("keydown", (event) => {
    const keyPressed = event.key.toLowerCase();

    switch (keyPressed) {
      case "w":
      case "arrowup":
        direction = "up";
        break;
      case "a":
      case "arrowleft":
        direction = "left";
        break;
      case "s":
      case "arrowdown":
        direction = "down";
        break;
      case "d":
      case "arrowright":
        direction = "right";
        break;
      case "p":
        if (moveDistance === 0) {
          // If moveDistance is 0, the game is currently paused, so resume it.
          console.log("RESUME");
          pauseOverlayOff();
          moveDistance = h;
        } else {
          // If moveDistance is not 0, the game is running, so pause it.
          console.log("PAUSE");
          pauseOverlayOn();
          h = moveDistance; // Store the current moveDistance value
          moveDistance = 0; // Pause the game by setting moveDistance to 0
        }
        break;
      case "q":
      case "0":
        if (SlowTime == true && C < 3 && t == 0) {
          moveDistance /= 4;
          speedMultiplier /= 4;
          C++;
          t++;
        } else if (SlowTime == true && C <= 3 && t == 1) {
          moveDistance *= 4;
          speedMultiplier *= 4;
          t--;
          if (C == 1)
            abilityIcon.querySelector("img").src = "../assets/Slow Time 2.png";
          else if (C == 2)
            abilityIcon.querySelector("img").src = "../assets/Slow Time 1.png";
          else if (C == 3)
            abilityIcon.querySelector("img").src = "../assets/Slow Time 0.png";
        }
        if (Ghost == true && C < 5 && t == 0) {
          t++;
          C++;
        } else if (Ghost == true && C <= 5 && t == 1) {
          t--;
        }
        if (Bomb == true && t == 0 && eggCount >= 1) {
          eggCount--;
          wormCount = 0;
          t++;
        }
        break;
    }
  });

  function wormSpawn() {
    const playerCollider = player.getBoundingClientRect();
    const wormCollider = worm.getBoundingClientRect();
    const maxRight = vw - worm.clientWidth;
    const maxLeft = vh - worm.clientWidth - 100;
    WisSpawn = true;
    do {
      worm.style.right = Math.floor(Math.random() * maxRight) + "px";
      worm.style.bottom = Math.floor(Math.random() * maxLeft) + "px";
    } while
      (
      playerCollider.left + 250 > wormCollider.right &&
      playerCollider.right + 250 < wormCollider.left &&
      playerCollider.top + 250 > wormCollider.bottom &&
      playerCollider.bottom + 250 < wormCollider.top
    );
    WisSpawn = false;
  }

  function obstacleSpawn() {
    const playerCollider = player.getBoundingClientRect();
    const obstacleCollider = obstacle.getBoundingClientRect();
    const spikeCollider = spike.getBoundingClientRect();
    const bombCollider = bombO.getBoundingClientRect();
    const maxRight = vw - obstacle.clientWidth;
    const maxLeft = vh - obstacle.clientWidth - 100;
    OisSpawn = true;
    do {
      obstacle.style.right = Math.floor(Math.random() * maxRight) + "px";
      obstacle.style.bottom = Math.floor(Math.random() * maxLeft) + "px";
    } while (
      playerCollider.left + 250 > obstacleCollider.right &&
      playerCollider.right + 250 < obstacleCollider.left &&
      playerCollider.top + 250 > obstacleCollider.bottom &&
      playerCollider.bottom + 250 < obstacleCollider.top
    );
    OisSpawn = false;
    if (eggCount < 4) {
      spike.style.right = obstacle.style.right;
      spike.style.top = obstacle.style.top;
      bombO.style.right = obstacle.style.right;
      bombO.style.top = obstacle.style.top;
    } else if (eggCount >= 4 && eggCount <= 8) {
      document.getElementById("spikes").style.display = "flex";
      SisSpawn = true;
      do {
        spike.style.right = Math.floor(Math.random() * maxRight) + "px";
        spike.style.bottom = Math.floor(Math.random() * maxLeft) + "px";
      } while (
        playerCollider.left + 250 > spikeCollider.right &&
        playerCollider.right + 250 < spikeCollider.left &&
        playerCollider.top + 250 > spikeCollider.bottom &&
        playerCollider.bottom + 250 < spikeCollider.top
      );
      SisSpawn = false;
      bombO.style.right = obstacle.style.right;
      bombO.style.top = obstacle.style.top;
    } else {
      SisSpawn = true;
      do {
        spike.style.right = Math.floor(Math.random() * maxRight) + "px";
        spike.style.bottom = Math.floor(Math.random() * maxLeft) + "px";
      } while (
        playerCollider.left + 250 > spikeCollider.right &&
        playerCollider.right + 250 < spikeCollider.left &&
        playerCollider.top + 250 > spikeCollider.bottom &&
        playerCollider.bottom + 250 < spikeCollider.top
      );
      SisSpawn = false;
      document.getElementById("owlbomb").style.display = "flex";
      BisSpawn = true;
      do {
        bombO.style.right = Math.floor(Math.random() * maxRight) + "px";
        bombO.style.bottom = Math.floor(Math.random() * maxLeft) + "px";
      } while (
        playerCollider.left + 300 > bombCollider.right &&
        playerCollider.right + 300 < bombCollider.left &&
        playerCollider.top + 300 > bombCollider.bottom &&
        playerCollider.bottom + 300 < bombCollider.top
      );
      BisSpawn = false;
    }
  }
  function setHUDSpeed() {
    speedValue.textContent = `${moveDistance}`;
  }

  function setEggCount() {
    points.textContent = `Current Eggs: ${eggCount}`;
  }

  function eggSpawn() {
    const newEgg = egg.cloneNode(true);
    newEgg.style.left = egg.style.left;
    newEgg.style.top = egg.style.top;
    document.querySelector(".game").appendChild(newEgg);
    eggs.push(newEgg);
  }

  function moveEggs() {
    for (let i = 0; i < eggs.length; i++) {
      if (direction == "down") {
        eggs[i].style.left = x + 20 + "px";
        eggs[i].style.top = y - 100 + "px";
      } else if (direction == "right") {
        eggs[i].style.left = x - 70 + "px";
        eggs[i].style.top = y + 50 + "px";
      } else if (direction == "up") {
        eggs[i].style.left = x + 22.5 + "px";
        eggs[i].style.top = y + 175 + "px";
      } else {
        eggs[i].style.left = x + 110 + "px";
        eggs[i].style.top = y + 50 + "px";
      }
    }
  }

  function collide() {
    const playerCollider = player.getBoundingClientRect();
    const wormCollider = worm.getBoundingClientRect();
    const obstacleCollider = obstacle.getBoundingClientRect();
    const spikeCollider = spike.getBoundingClientRect();
    const bombCollider = bombO.getBoundingClientRect();

    if (Ghost == false || (Ghost == true && t == 0)) {
      if (
        playerCollider.left < wormCollider.right &&
        playerCollider.right > wormCollider.left &&
        playerCollider.top < wormCollider.bottom &&
        playerCollider.bottom > wormCollider.top && WisSpawn == false
      ) {
        if (playerData.options[0].sound == true) {
          var audioW = new Audio('../assets/PickUp.wav');
          audioW.volume = 0.2;
          audioW.play();
        }
        wormSpawn();
        moveDistance += speedMultiplier;
        wormCount++;
        if (SlowTime == true && t == 1) {
          wormCount--;
        }
        if (AccelerateAbility == true) {
          moveDistance += speedMultiplier * 3;
          wormCount += 3;
        }
        if (wormCount == 4) {
          wormCount -= 4;
          eggCount++;
          obstacleSpawn();
          //eggSpawn(); 
        }
      }
      if (
        playerCollider.left < obstacleCollider.right &&
        playerCollider.right > obstacleCollider.left &&
        playerCollider.top < obstacleCollider.bottom &&
        playerCollider.bottom > obstacleCollider.top &&
        OisSpawn == false
      ) {
        if (playerData.options[0].sound == true) {
          var audioW = new Audio('../assets/Die.wav');
          audioW.volume = 0.3;
          audioW.play();
        }
        moveDistance = 0;
        gamerOverOverlayOn();
        obstacleSpawn();
      }
      if (eggCount >= 4) {
        if (
          playerCollider.left < spikeCollider.right &&
          playerCollider.right > spikeCollider.left &&
          playerCollider.top < spikeCollider.bottom &&
          playerCollider.bottom > spikeCollider.top &&
          SisSpawn == false
        ) {
          if (playerData.options[0].sound == true) {
            var audioW = new Audio('../assets/Die.wav');
            audioW.volume = 0.3;
            audioW.play();
          }
          moveDistance = 0;
          gamerOverOverlayOn();
          obstacleSpawn();
        }
      }
      if (eggCount >= 8) {
        if (
          playerCollider.left < bombCollider.right &&
          playerCollider.right > bombCollider.left &&
          playerCollider.top < bombCollider.bottom &&
          playerCollider.bottom > bombCollider.top &&
          BisSpawn == false
        ) {
          if (playerData.options[0].sound == true) {
            var audioW = new Audio('../assets/Die.wav');
            audioW.volume = 0.3;
            audioW.play();
          }
          moveDistance = 0;
          gamerOverOverlayOn();
          obstacleSpawn();
        }
      }
    }
    if (playerCollider.left > vw) x = 0;
    if (playerCollider.right < 0) x = vw;
    if (playerCollider.top > vh) y = 0;
    if (playerCollider.bottom < 90) y = vh;
  }

  function skinSelection(index) {
    const xhr = new XMLHttpRequest();
    const playerData = "../playerData.json";

    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        // If data can be loaded execute
        if (xhr.status === 200) {
          const jsonData = JSON.parse(xhr.responseText);
          const cosmetics = jsonData.cosmetics[0];
          const skinKeys = Object.keys(cosmetics);
          const selectedSkin = cosmetics[skinKeys[index]];

          // Update playerData with the new currentSkinIndex
          jsonData.currentSkinIndex = index;

          localStorage.setItem("selectedSkinIndex", index);

          localStorage.setItem("playerData", JSON.stringify(jsonData));

          const selectedSkinImage = document.getElementById("player");

          if (index === 0) {
            selectedSkinImage.src = "../assets/owls/Owl.png";
          } else if (index >= 1 && index <= 4) {
            selectedSkinImage.src = `../assets/owls/Owl_${selectedSkin.name}.png`;
          } else {
            // Handle any other cases here, or show a default image
            selectedSkinImage.src = "../assets/owls/default.png";
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

  function gameLoop() {
    movePlayer();
    //moveEggs();
    requestAnimationFrame(gameLoop);
    collide();
    setHUDSpeed();
    setEggCount();
    if (Bomb == true && t == 1) {
      wormSpawn();
      obstacleSpawn();
      t--;
    }
  }

  //Game Init
  if (selectedSkinIndex !== null) {
    skinSelection(parseInt(selectedSkinIndex, 10));
  } else {
    skinSelection(0);
  }
  document.getElementById("owlbomb").style.display = "none";
  document.getElementById("spikes").style.display = "none";
  gamerOverOverlayOff();
  pauseOverlayOff();
  wormSpawn();
  obstacleSpawn();
  gameLoop();
});
