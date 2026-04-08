const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');

const GRID_SIZE = 20;
const TILE_SIZE = canvas.width / GRID_SIZE;

const WALLS = [
  { x: 5, y: 5, w: 10, h: 10 },
  { x: 1, y: 1, w: 3, h: 3 },
  { x: 16, y: 1, w: 3, h: 3 },
  { x: 1, y: 16, w: 3, h: 3 },
  { x: 16, y: 16, w: 3, h: 3 },
];

let player = { x: 1, y: 1, nextX: 1, nextY: 1 };
let pellets = [];
let score = 0;
let gameOver = false;

function initPellets() {
  pellets = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (!isWall(i, j) && !(i === player.x && j === player.y)) {
        if (Math.random() > 0.15) {
          pellets.push({ x: i, y: j });
        }
      }
    }
  }
}

function isWall(x, y) {
  if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
    return true;
  }
  for (let wall of WALLS) {
    if (x >= wall.x && x < wall.x + wall.w && y >= wall.y && y < wall.y + wall.h) {
      return true;
    }
  }
  return false;
}

function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      player.nextY = player.y - 1;
      e.preventDefault();
      break;
    case 'ArrowDown':
      player.nextY = player.y + 1;
      e.preventDefault();
      break;
    case 'ArrowLeft':
      player.nextX = player.x - 1;
      e.preventDefault();
      break;
    case 'ArrowRight':
      player.nextX = player.x + 1;
      e.preventDefault();
      break;
  }
}

function updatePlayer() {
  if (!isWall(player.nextX, player.nextY)) {
    player.x = player.nextX;
    player.y = player.nextY;
  }
}

function collectPellets() {
  for (let i = pellets.length - 1; i >= 0; i--) {
    if (pellets[i].x === player.x && pellets[i].y === player.y) {
      pellets.splice(i, 1);
      score += 10;
      scoreDisplay.textContent = 'Score: ' + score;
    }
  }
}

function checkGameOver() {
  if (pellets.length === 0 && !gameOver) {
    gameOver = true;
    gameOverScreen.style.display = 'block';
    finalScoreDisplay.textContent = score;
  }
}

function drawPlayer() {
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(
    player.x * TILE_SIZE + TILE_SIZE / 2,
    player.y * TILE_SIZE + TILE_SIZE / 2,
    TILE_SIZE / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function drawPellets() {
  ctx.fillStyle = '#ffb8b8';
  for (let pellet of pellets) {
    ctx.fillRect(
      pellet.x * TILE_SIZE + TILE_SIZE / 2 - 2,
      pellet.y * TILE_SIZE + TILE_SIZE / 2 - 2,
      4,
      4
    );
  }
}

function drawWalls() {
  ctx.fillStyle = '#0033ff';
  for (let wall of WALLS) {
    ctx.fillRect(
      wall.x * TILE_SIZE,
      wall.y * TILE_SIZE,
      wall.w * TILE_SIZE,
      wall.h * TILE_SIZE
    );
  }
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  drawWalls();
  drawPellets();
  drawPlayer();
}

function update() {
  if (!gameOver) {
    updatePlayer();
    collectPellets();
    checkGameOver();
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

initPellets();
window.addEventListener('keydown', handleInput);
gameLoop();