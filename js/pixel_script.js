
const TILE_SIZE = 24;


const RAW_MAP = [
    "####################",
    "#........##........#",
    "#.####...##...####.#",
    "#.#  #...##...#  #.#",
    "#.####...##...####.#",
    "#........P.........#",
    "####################"
];


const map = RAW_MAP.map(row => row.split(''));
const ROWS = map.length;
const COLS = map[0].length;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = COLS * TILE_SIZE;
canvas.height = ROWS * TILE_SIZE;

const scoreDiv = document.getElementById('score');


let pacman = {
    x: 1,
    y: 1,
    dirX: 1,
    dirY: 0,
    mouthPhase: 0,
    mouthOpening: true
};

let totalDots = 0;
for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
        if (map[y][x] === '.') totalDots++;
        if (map[y][x] === 'P') {
            pacman.x = x;
            pacman.y = y;
            map[y][x] = ' '; 
        }
    }
}

let score = 0;
let gameWon = false;


function drawMap() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const tile = map[y][x];
            const px = x * TILE_SIZE;
            const py = y * TILE_SIZE;

            if (tile === '#') {
                
                ctx.fillStyle = "#0033cc";
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            } else {
                
                ctx.fillStyle = "#000000";
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

                
                if (tile === '.') {
                    ctx.beginPath();
                    ctx.fillStyle = "#ffcc00";
                    ctx.arc(
                        px + TILE_SIZE / 2,
                        py + TILE_SIZE / 2,
                        3,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        }
    }
}

function drawPacman() {
    const centerX = pacman.x * TILE_SIZE + TILE_SIZE / 2;
    const centerY = pacman.y * TILE_SIZE + TILE_SIZE / 2;

    
    if (pacman.mouthOpening) {
        pacman.mouthPhase += 0.08;
        if (pacman.mouthPhase >= 1) pacman.mouthOpening = false;
    } else {
        pacman.mouthPhase -= 0.08;
        if (pacman.mouthPhase <= 0) pacman.mouthOpening = true;
    }

    const maxMouthAngle = Math.PI / 4;
    const mouthAngle = maxMouthAngle * pacman.mouthPhase;

    let directionAngle = 0;
    if (pacman.dirX === 1 && pacman.dirY === 0) directionAngle = 0;           // droite
    if (pacman.dirX === -1 && pacman.dirY === 0) directionAngle = Math.PI;    // gauche
    if (pacman.dirX === 0 && pacman.dirY === -1) directionAngle = -Math.PI / 2; // haut
    if (pacman.dirX === 0 && pacman.dirY === 1) directionAngle = Math.PI / 2;   // bas

    ctx.fillStyle = "#ffff00";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
        centerX,
        centerY,
        TILE_SIZE / 2 - 2,
        directionAngle + mouthAngle,
        directionAngle - mouthAngle,
        false
    );
    ctx.closePath();
    ctx.fill();
}

function isWall(x, y) {
    if (y < 0 || y >= ROWS || x < 0 || x >= COLS) return true;
    return map[y][x] === '#';
}

function tryMove(dx, dy) {
    if (gameWon) return;

    const newX = pacman.x + dx;
    const newY = pacman.y + dy;

    if (!isWall(newX, newY)) {
       
        pacman.x = newX;
        pacman.y = newY;
        pacman.dirX = dx;
        pacman.dirY = dy;

        
        if (map[newY][newX] === '.') {
            map[newY][newX] = ' ';
            score++;
            updateScore();
            if (score === totalDots) {
                gameWon = true;
                scoreDiv.textContent = "Score : " + score + "  |  GG, tu as tout mangé !";
                
            }
        }
    }
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            tryMove(0, -1);
            break;
        case 'ArrowDown':
            tryMove(0, 1);
            break;
        case 'ArrowLeft':
            tryMove(-1, 0);
            break;
        case 'ArrowRight':
            tryMove(1, 0);
            break;
    }
});

function updateScore() {
    scoreDiv.textContent = "Score : " + score;
}


function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    requestAnimationFrame(loop);
}

updateScore();
loop();