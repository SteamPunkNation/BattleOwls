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
  //if (index == 1)
  //{
  //player.querySelector('img').src = '../assets/owls/Owl_Red.png';
  //egg.querySelector('img').src = '../assets/eggs/Egg Red.png';
  //}
  //else if (index == 2)
  //{
  //player.querySelector('img').src = '../assets/owls/Owl_Blue.png';
  //egg.querySelector('img').src = '../assets/eggs/Egg Blue.png';
  //}
  //else if (index == 3)
  //{
  //player.querySelector('img').src = '../assets/owls/Owl_Green.png';
  //egg.querySelector('img').src = '../assets/eggs/Egg Green.png';
  //}
  let direction = "";
  let speedMultiplier = 0.25;
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let x = vw / 2;
  let y = vh / 2;
  let moveDistance = 2;
  let eggCount = 0;
  let wormCount = 0;
  let AccelerateAbility = true;
  let SlowTime = false;
  let Ghost = false;
  let Bomb = false;
  let i = 0;
  let eggs = [];
  let C = 0;
  let t = 0;
  let h = 0;
  let selectedSkinIndex = localStorage.getItem("selectedSkinIndex");

  if (AccelerateAbility == true)
    abilityIcon.querySelector("img").src = "../assets/Speed Boost.png";
  else if (SlowTime == true)
    abilityIcon.querySelector("img").src = "../assets/Slow Time 3.png";
  else if (Ghost == true)
    abilityIcon.querySelector("img").src = "../assets/Ghost.png";
  else if (Bomb == true)
    abilityIcon.querySelector("img").src = "../assets/Bomb.png";
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
      egg.style.left = x + "px";
      egg.style.top = y - 125 + "px";
    } else if (direction == "right") {
      egg.style.left = x - 100 + "px";
      egg.style.top = y + 50 + "px";
    } else if (direction == "up") {
      egg.style.left = x + "px";
      egg.style.top = y + 150 + "px";
    } else {
      egg.style.left = x + 100 + "px";
      egg.style.top = y + 50 + "px";
    }
  }
  function moveEgg() {}

  restartBtn.addEventListener("click", function () {
    console.log("Joined singleplayer");
    // Redirect to the singleplayer.html page when the button is clicked
    window.location.replace("singleplayer.html");
  });
  quitBtn.addEventListener("click", function () {
    console.log("QUIT");
    // Redirect to mainmenu.html page when the button is clicked
    window.location.replace("/");
  });

  restartPBtn.addEventListener("click", function () {
    console.log("Joined singleplayer");
    // Redirect to the singleplayer.html page when the button is clicked
    window.location.replace("singleplayer.html");
  });
  quitPBtn.addEventListener("click", function () {
    console.log("QUIT");
    // Redirect to mainmenu.html page when the button is clicked
    window.location.replace("/");
  });
  resumeBtn.addEventListener("click", function () {
    console.log("RESUME");
    // Remove overlay and resume game when clicked
    pauseOverlayOff();
    moveDistance = h;
  });

  function pauseOverlayOn() {
    document.getElementById("pauseMenu").style.display = "flex";
  }

  function pauseOverlayOff() {
    document.getElementById("pauseMenu").style.display = "none";
  }

  function gamerOverOverlayOn() {
    document.getElementById("gameOverMenu").style.display = "flex";
  }

  function gamerOverOverlayOff() {
    document.getElementById("gameOverMenu").style.display = "none";
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

    worm.style.right = Math.floor(Math.random() * maxRight) + "px";
    worm.style.bottom = Math.floor(Math.random() * maxLeft) + "px";
    if (
      playerCollider.left < wormCollider.right &&
      playerCollider.right > wormCollider.left &&
      playerCollider.top < wormCollider.bottom &&
      playerCollider.bottom > wormCollider.top
    )
      wormSpawn();
  }

  function obstacleSpawn() {
    const playerCollider = player.getBoundingClientRect();
    const obstacleCollider = obstacle.getBoundingClientRect();
    const spikeCollider = spike.getBoundingClientRect();
    const bombCollider = bombO.getBoundingClientRect();
    const maxRight = vw - obstacle.clientWidth;
    const maxLeft = vh - obstacle.clientWidth - 100;
    do {
      obstacle.style.right = Math.floor(Math.random() * maxRight) + "px";
      obstacle.style.bottom = Math.floor(Math.random() * maxLeft) + "px";
    } while (
      playerCollider.left > obstacleCollider.right &&
      playerCollider.right < obstacleCollider.left &&
      playerCollider.top > obstacleCollider.bottom &&
      playerCollider.bottom < obstacleCollider.top
    );
    if (eggCount < 4) {
      spike.style.right = obstacle.style.right;
      spike.style.top = obstacle.style.top;
      bombO.style.right = obstacle.style.right;
      bombO.style.top = obstacle.style.top;
    } else if (eggCount >= 4 && eggCount <= 8) {
      spike.querySelector("img").src = "../assets/Spikes.png";
      do {
        spike.style.right = Math.floor(Math.random() * maxRight) + "px";
        spike.style.bottom = Math.floor(Math.random() * maxLeft) + "px";
      } while (
        playerCollider.left > spikeCollider.right &&
        playerCollider.right < spikeCollider.left &&
        playerCollider.top > spikeCollider.bottom &&
        playerCollider.bottom < spikeCollider.top
      );
      bombO.style.right = obstacle.style.right;
      bombO.style.top = obstacle.style.top;
    } else {
      do {
        spike.style.right = Math.floor(Math.random() * maxRight) + "px";
        spike.style.bottom = Math.floor(Math.random() * maxLeft) + "px";
      } while (
        playerCollider.left > spikeCollider.right &&
        playerCollider.right < spikeCollider.left &&
        playerCollider.top > spikeCollider.bottom &&
        playerCollider.bottom < spikeCollider.top
      );
      bombO.querySelector("img").src = "../assets/Bomb_Obstacle.png";
      do {
        bombO.style.right = Math.floor(Math.random() * maxRight) + "px";
        bombO.style.bottom = Math.floor(Math.random() * maxLeft) + "px";
      } while (
        playerCollider.left > bombCollider.right &&
        playerCollider.right < bombCollider.left &&
        playerCollider.top > bombCollider.bottom &&
        playerCollider.bottom < bombCollider.top
      );
    }
  }
  function setHUDSpeed() {
    speedValue.textContent = `${moveDistance}`;
  }

  function setEggCount() {
    points.textContent = `Current Eggs: ${eggCount}`;
  }

  function eggSpawn() {
    i++;
    const newEgg = egg.cloneNode(true);
    newEgg.id = ""; // Remove the id to avoid duplicate IDs on the page
    newEgg.style.top = player.style.top + y + "px"; //Set the egg's position on the Y-axis
    newEgg.style.left = player.style.left + x + i * 50 + "px"; // Set the egg's position on the X-axis
    document.querySelector(".game").appendChild(newEgg);
    eggs.push(newEgg);
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
        playerCollider.bottom > wormCollider.top
      ) {
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
          //eggSpawn(); // Commented out eggSpawn to test the game without the buggy egg spawns, uncomment it when you want to test eggSpawn.
        }
      }
      if (
        playerCollider.left < obstacleCollider.right &&
        playerCollider.right > obstacleCollider.left &&
        playerCollider.top < obstacleCollider.bottom &&
        playerCollider.bottom > obstacleCollider.top
      ) {
        moveDistance = 0;
        gamerOverOverlayOn();
      }
      if (eggCount >= 4) {
        if (
          playerCollider.left < spikeCollider.right &&
          playerCollider.right > spikeCollider.left &&
          playerCollider.top < spikeCollider.bottom &&
          playerCollider.bottom > spikeCollider.top
        ) {
          moveDistance = 0;
          gamerOverOverlayOn();
        }
      }
      if (eggCount >= 8) {
        if (
          playerCollider.left < bombCollider.right &&
          playerCollider.right > bombCollider.left &&
          playerCollider.top < bombCollider.bottom &&
          playerCollider.bottom > bombCollider.top
        ) {
          moveDistance = 0;
          gamerOverOverlayOn();
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

    xhr.onreadystatechange = function () {
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
  gamerOverOverlayOff();
  pauseOverlayOff();
  wormSpawn();
  obstacleSpawn();
  gameLoop();
});
