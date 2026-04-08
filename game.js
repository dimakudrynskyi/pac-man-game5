const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const CELL_SIZE = canvas.width / GRID_WIDTH;

const gameState = {
  player: {
    x: 10,
    y: 7,
    size: CELL_SIZE * 0.8
  },
  ghosts: [
    { x: 5, y: 5, color: '#ff0000' },
    { x: 15, y: 5, color: '#ff00ff' },
    { x: 5, y: 10, color: '#00ffff' },
    { x: 15, y: 10, color: '#ffb897' }
  ],
  pellets: [],
  score: 0,
  gameOver: false,
  won: false,
  frameCount: 0
};

function initializePellets() {
  gameState.pellets = [];
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      if (!isGhostStart(x, y) && !(x === gameState.player.x && y === gameState.player.y)) {
        gameState.pellets.push({ x, y, collected: false });
      }
    }
  }
}

function isGhostStart(x, y) {
  return gameState.ghosts.some(g => g.x === x && g.y === y);
}

function clearCanvas() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  const centerX = gameState.player.x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = gameState.player.y * CELL_SIZE + CELL_SIZE / 2;
  const radius = gameState.player.size / 2;

  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawGhosts() {
  gameState.ghosts.forEach(ghost => {
    const x = ghost.x * CELL_SIZE;
    const y = ghost.y * CELL_SIZE;
    const size = CELL_SIZE * 0.9;

    ctx.fillStyle = ghost.color;
    ctx.fillRect(x + (CELL_SIZE - size) / 2, y + (CELL_SIZE - size) / 2, size, size);
  });
}

function drawPellets() {
  gameState.pellets.forEach(pellet => {
    if (!pellet.collected) {
      const centerX = pellet.x * CELL_SIZE + CELL_SIZE / 2;
      const centerY = pellet.y * CELL_SIZE + CELL_SIZE / 2;

      ctx.fillStyle = '#ffb8db';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawGrid() {
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 0.5;

  for (let x = 0; x <= GRID_WIDTH; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL_SIZE, 0);
    ctx.lineTo(x * CELL_SIZE, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= GRID_HEIGHT; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL_SIZE);
    ctx.lineTo(canvas.width, y * CELL_SIZE);
    ctx.stroke();
  }
}

function update() {
  gameState.frameCount++;
}

function render() {
  clearCanvas();
  drawGrid();
  drawPellets();
  drawPlayer();
  drawGhosts();

  if (gameState.gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff0000';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
  }

  if (gameState.won) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff00';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  render();
  scoreDisplay.textContent = gameState.score;
  requestAnimationFrame(gameLoop);
}

function initialize() {
  initializePellets();
  gameLoop();
}

initialize();