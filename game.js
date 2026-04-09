const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

const TILE_SIZE = 20;
const COLS = canvas.width / TILE_SIZE;
const ROWS = canvas.height / TILE_SIZE;

const GAME_SPEED = 100;
let lastMoveTime = 0;

let score = 0;
let gameRunning = true;

const pacman = {
  x: 1,
  y: 1,
  direction: 'RIGHT',
  nextDirection: 'RIGHT'
};

const ghosts = [
  { x: 5, y: 5, color: '#FF0000', directionX: 1, directionY: 0 },
  { x: 10, y: 5, color: '#FFB6C1', directionX: -1, directionY: 0 },
  { x: 5, y: 10, color: '#00FFFF', directionX: 0, directionY: 1 },
  { x: 10, y: 10, color: '#FFB347', directionX: 1, directionY: 0 }
];

let pellets = [];
let powerPellets = [];

function initializePellets() {
  pellets = [];
  powerPellets = [];
  
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if ((row !== pacman.y || col !== pacman.x) &&
          !ghosts.some(ghost => ghost.x === col && ghost.y === row)) {
        if ((row === 0 || row === ROWS - 1 || col === 0 || col === COLS - 1) &&
            Math.random() < 0.15) {
          powerPellets.push({ x: col, y: row });
        } else if (Math.random() < 0.8) {
          pellets.push({ x: col, y: row });
        }
      }
    }
  }
}

function isWall(x, y) {
  return x < 0 || x >= COLS || y < 0 || y >= ROWS;
}

function canMoveTo(x, y) {
  return !isWall(x, y);
}

function updatePacmanDirection() {
  const nextX = pacman.x + (pacman.nextDirection === 'RIGHT' ? 1 : pacman.nextDirection === 'LEFT' ? -1 : 0);
  const nextY = pacman.y + (pacman.nextDirection === 'DOWN' ? 1 : pacman.nextDirection === 'UP' ? -1 : 0);
  
  if (canMoveTo(nextX, nextY)) {
    pacman.direction = pacman.nextDirection;
  }
}

function movePacman() {
  updatePacmanDirection();
  
  let nextX = pacman.x + (pacman.direction === 'RIGHT' ? 1 : pacman.direction === 'LEFT' ? -1 : 0);
  let nextY = pacman.y + (pacman.direction === 'DOWN' ? 1 : pacman.direction === 'UP' ? -1 : 0);
  
  if (canMoveTo(nextX, nextY)) {
    pacman.x = nextX;
    pacman.y = nextY;
  }
  
  checkPelletCollision();
}

function checkPelletCollision() {
  pellets = pellets.filter(pellet => {
    if (pellet.x === pacman.x && pellet.y === pacman.y) {
      score += 10;
      return false;
    }
    return true;
  });
  
  powerPellets = powerPellets.filter(pellet => {
    if (pellet.x === pacman.x && pellet.y === pacman.y) {
      score += 50;
      return false;
    }
    return true;
  });
}

function moveGhosts() {
  ghosts.forEach(ghost => {
    let nextX = ghost.x + ghost.directionX;
    let nextY = ghost.y + ghost.directionY;
    
    if (!canMoveTo(nextX, nextY)) {
      const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
      ];
      const validDirection = directions.find(dir => canMoveTo(ghost.x + dir.x, ghost.y + dir.y));
      if (validDirection) {
        ghost.directionX = validDirection.x;
        ghost.directionY = validDirection.y;
        nextX = ghost.x + ghost.directionX;
        nextY = ghost.y + ghost.directionY;
      }
    }
    
    ghost.x = nextX;
    ghost.y = nextY;
  });
  
  checkGhostCollision();
}

function checkGhostCollision() {
  ghosts.forEach(ghost => {
    if (ghost.x === pacman.x && ghost.y === pacman.y) {
      endGame();
    }
  });
}

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawPacman() {
  ctx.fillStyle = '#FFFF00';
  ctx.beginPath();
  ctx.arc(pacman.x * TILE_SIZE + TILE_SIZE / 2, pacman.y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawGhosts() {
  ghosts.forEach(ghost => {
    ctx.fillStyle = ghost.color;
    ctx.fillRect(ghost.x * TILE_SIZE + 2, ghost.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(ghost.x * TILE_SIZE + 4, ghost.y * TILE_SIZE + 4, 4, 4);
    ctx.fillRect(ghost.x * TILE_SIZE + TILE_SIZE - 8, ghost.y * TILE_SIZE + 4, 4, 4);
  });
}

function drawPellets() {
  ctx.fillStyle = '#FFB6C1';
  pellets.forEach(pellet => {
    ctx.beginPath();
    ctx.arc(pellet.x * TILE_SIZE + TILE_SIZE / 2, pellet.y * TILE_SIZE + TILE_SIZE / 2, 2, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.fillStyle = '#FFD700';
  powerPellets.forEach(pellet => {
    ctx.beginPath();
    ctx.arc(pellet.x * TILE_SIZE + TILE_SIZE / 2, pellet.y * TILE_SIZE + TILE_SIZE / 2, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawGame() {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = '#444444';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath();
    ctx.moveTo(i * TILE_SIZE, 0);
    ctx.lineTo(i * TILE_SIZE, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i <= ROWS; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * TILE_SIZE);
    ctx.lineTo(canvas.width, i * TILE_SIZE);
    ctx.stroke();
  }
  
  drawPellets();
  drawGhosts();
  drawPacman();
}

function updateScore() {
  scoreDisplay.textContent = 'Score: ' + score;
}

function endGame() {
  gameRunning = false;
  finalScoreDisplay.textContent = score;
  gameOverScreen.style.display = 'flex';
}

function resetGame() {
  pacman.x = 1;
  pacman.y = 1;
  pacman.direction = 'RIGHT';
  pacman.nextDirection = 'RIGHT';
  
  ghosts[0] = { x: 5, y: 5, color: '#FF0000', directionX: 1, directionY: 0 };
  ghosts[1] = { x: 10, y: 5, color: '#FFB6C1', directionX: -1, directionY: 0 };
  ghosts[2] = { x: 5, y: 10, color: '#00FFFF', directionX: 0, directionY: 1 };
  ghosts[3] = { x: 10, y: 10, color: '#FFB347', directionX: 1, directionY: 0 };
  
  score = 0;
  gameRunning = true;
  lastMoveTime = 0;
  
  gameOverScreen.style.display = 'none';
  initializePellets();
  updateScore();
}

function gameLoop(currentTime) {
  if (!gameRunning) {
    requestAnimationFrame(gameLoop);
    return;
  }
  
  if (currentTime - lastMoveTime >= GAME_SPEED) {
    movePacman();
    moveGhosts();
    updateScore();
    lastMoveTime = currentTime;
  }
  
  drawGame();
  requestAnimationFrame(gameLoop);
}

function handleKeyPress(e) {
  const key = e.key.toUpperCase();
  
  if (key === 'ARROWUP' || key === 'W') {
    pacman.nextDirection = 'UP';
    e.preventDefault();
  } else if (key === 'ARROWDOWN' || key === 'S') {
    pacman.nextDirection = 'DOWN';
    e.preventDefault();
  } else if (key === 'ARROWLEFT' || key === 'A') {
    pacman.nextDirection = 'LEFT';
    e.preventDefault();
  } else if (key === 'ARROWRIGHT' || key === 'D') {
    pacman.nextDirection = 'RIGHT';
    e.preventDefault();
  }
}

document.addEventListener('keydown', handleKeyPress);
restartButton.addEventListener('click', resetGame);

initializePellets();
updateScore();
requestAnimationFrame(gameLoop);