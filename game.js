const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

const GRID_SIZE = 20;
const COLS = canvas.width / GRID_SIZE;
const ROWS = canvas.height / GRID_SIZE;

let gameRunning = true;
let score = 0;

let pacman = {
    x: 5,
    y: 5,
    vx: 0,
    vy: 0
};

let ghost = {
    x: Math.floor(COLS / 2),
    y: Math.floor(ROWS / 2),
    vx: 1,
    vy: 0
};

let pellets = [];
let powerPellets = [];

function initGame() {
    gameRunning = true;
    score = 0;
    pacman = { x: 5, y: 5, vx: 0, vy: 0 };
    ghost = { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2), vx: 1, vy: 0 };
    pellets = [];
    powerPellets = [];
    gameOverScreen.classList.remove('show');
    scoreDisplay.textContent = 'Score: 0';
    
    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            if ((i !== pacman.x || j !== pacman.y) && (i !== ghost.x || j !== ghost.y)) {
                if (Math.random() < 0.1) {
                    pellets.push({ x: i, y: j });
                }
            }
        }
    }
}

function updatePacman() {
    pacman.x += pacman.vx;
    pacman.y += pacman.vy;
    
    pacman.x = (pacman.x + COLS) % COLS;
    pacman.y = (pacman.y + ROWS) % ROWS;
}

function updateGhost() {
    if (Math.random() < 0.1) {
        const directions = [
            { vx: 1, vy: 0 },
            { vx: -1, vy: 0 },
            { vx: 0, vy: 1 },
            { vx: 0, vy: -1 }
        ];
        const dir = directions[Math.floor(Math.random() * directions.length)];
        ghost.vx = dir.vx;
        ghost.vy = dir.vy;
    }
    
    ghost.x += ghost.vx;
    ghost.y += ghost.vy;
    
    ghost.x = (ghost.x + COLS) % COLS;
    ghost.y = (ghost.y + ROWS) % ROWS;
}

function checkCollisions() {
    if (pacman.x === ghost.x && pacman.y === ghost.y) {
        endGame();
        return;
    }
    
    pellets = pellets.filter(pellet => {
        if (pacman.x === pellet.x && pacman.y === pellet.y) {
            score += 10;
            return false;
        }
        return true;
    });
}

function endGame() {
    gameRunning = false;
    gameOverScreen.classList.add('show');
    finalScoreDisplay.textContent = `Final Score: ${score}`;
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(pacman.x * GRID_SIZE + 2, pacman.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);
    
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(ghost.x * GRID_SIZE + 2, ghost.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);
    
    ctx.fillStyle = '#ffb8db';
    pellets.forEach(pellet => {
        ctx.fillRect(pellet.x * GRID_SIZE + 8, pellet.y * GRID_SIZE + 8, 4, 4);
    });
    
    scoreDisplay.textContent = `Score: ${score}`;
}

function update() {
    if (!gameRunning) return;
    
    updatePacman();
    updateGhost();
    checkCollisions();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
            pacman.vx = 0;
            pacman.vy = -1;
            e.preventDefault();
            break;
        case 'ArrowDown':
            pacman.vx = 0;
            pacman.vy = 1;
            e.preventDefault();
            break;
        case 'ArrowLeft':
            pacman.vx = -1;
            pacman.vy = 0;
            e.preventDefault();
            break;
        case 'ArrowRight':
            pacman.vx = 1;
            pacman.vy = 0;
            e.preventDefault();
            break;
    }
});

restartBtn.addEventListener('click', () => {
    initGame();
    gameLoop();
});

initGame();
gameLoop();