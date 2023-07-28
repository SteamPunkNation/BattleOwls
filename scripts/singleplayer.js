  document.addEventListener('DOMContentLoaded', (event) => {
  const player = document.getElementById('player');
  const worm = document.getElementById('worm');
  const egg = document.getElementById('egg');
  let direction = '';
  let speedMultiplier = 0.25;
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let x = vw / 2;
  let y = vh / 2;
  let moveDistance = 2;
  let eggCount = 0;
  let wormCount =0;
  let AccelerateAbility=true;
  let i=0;
  let eggs = [];
// Game functions
  function movePlayer() {
    switch (direction) {
      case 'up':
        y -= moveDistance;
        break;
      case 'left':
        x -= moveDistance;
        break;
      case 'down':
        y += moveDistance;
        break;
      case 'right':
        x += moveDistance;
        break;
    } 
    player.style.left = x + 'px';
    player.style.top = y + 'px';
    
    if (direction=="down") 
    {
    egg.style.left=x+ 'px';
    egg.style.top=y-125+ 'px';
    }
    else if (direction=="right")
    {
    egg.style.left=x-100+ 'px';
    egg.style.top=y+50+ 'px';
    }
    else if (direction=="up")
    {
    egg.style.left=x+ 'px';
    egg.style.top=y+150+ 'px';
    }
    else 
    {
    egg.style.left=x+100+ 'px';
    egg.style.top=y+50+ 'px';
    }
    
  } 
    function moveEgg() {
      
    }
  
  document.addEventListener('keydown', (event) => {
    const keyPressed = event.key.toLowerCase();

    switch (keyPressed) {
      case 'w':
      case 'arrowup':
        direction = 'up';
        break;
      case 'a':
      case 'arrowleft':
        direction = 'left';
        break;
      case 's':
      case 'arrowdown':
        direction = 'down';
        break;
      case 'd':
      case 'arrowright':
        direction = 'right';
        break;
      case 'p':
        direction = 'pause';
        speedValue.textContent = `0`; //TODO FIX
        break;
    }
  });

  function wormSpawn() {
    const maxRight = vw - worm.clientWidth;
    const maxLeft = vh - worm.clientWidth - 100;

    worm.style.right = Math.floor(Math.random() * maxRight) + 'px';
    worm.style.bottom = Math.floor(Math.random() * maxLeft) + 'px';
  }

  function setHUDSpeed(){
    speedValue.textContent = `${moveDistance}`;
  }

  function setEggCount(){
    points.textContent = `Current Eggs: ${eggCount}`;
  }

  function eggSpawn() {
    i++;
    const newEgg = egg.cloneNode(true);
    newEgg.id = ""; // Remove the id to avoid duplicate IDs on the page
    newEgg.style.top=player.style.top+y+'px' //Set the egg's position on the Y-axis
    newEgg.style.left = player.style.left+x + (i*50) + "px"; // Set the egg's position on the X-axis
    document.querySelector(".game").appendChild(newEgg);
eggs.push(newEgg);
  }
  
  function collide() {
    
    const playerCollider = player.getBoundingClientRect();
    const wormCollider = worm.getBoundingClientRect();
    
    if (playerCollider.left < wormCollider.right && playerCollider.right > wormCollider.left &&       playerCollider.top < wormCollider.bottom && playerCollider.bottom > wormCollider.top){
      wormSpawn();
      moveDistance += speedMultiplier;
      wormCount++;
      if (AccelerateAbility==true)
      {
      moveDistance += speedMultiplier*3;
      wormCount+=3;
      }
      if (wormCount==4) 
      {
        wormCount-=4;
        eggCount++;
        //eggSpawn(); // Commented out eggSpawn to test the game without the buggy egg spawns, uncomment it when you want to test eggSpawn.
      }
    }
    if(playerCollider.left>vw)
      x=0;
    if(playerCollider.right<0)
      x=vw;
    if(playerCollider.top>vh)
      y=0;
    if(playerCollider.bottom<90)
      y=vh;
  }
    
  
  function gameLoop() {
    movePlayer();
    requestAnimationFrame(gameLoop);
    collide();
    setHUDSpeed();
    setEggCount();
  }


  //Game Init 
  wormSpawn();
  gameLoop();
});



