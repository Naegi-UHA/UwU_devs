const gameArea = document.getElementById("gameArea");
// Références aux boutons et à l'affichage
const speedUpBtn = document.getElementById("speedUpBtn");
const speedDownBtn = document.getElementById("speedDownBtn");
const currentSpeedDisplay = document.getElementById("currentSpeedDisplay");
const nextLevelBtn = document.getElementById("nextLevelBtn");

const gameSize = { width: 240, height: 240 };
const snakeSize = 30;
let snake = [{ x: 150, y: 150 }];
let food = { x: 60, y: 60 };
let direction = { x: 0, y: 0 };

// NOUVEAU: Variables pour la gestion de la vitesse
let gameInterval;
let gameSpeed = 200; // Vitesse initiale en millisecondes (200ms = 5 mouvements/seconde)
let directionChanged = false; // nouveau drapeau

// Limites pour la vitesse (le délai en ms)
const MIN_SPEED = 50;  // Le plus rapide
const MAX_SPEED = 500; // Le plus lent

// --- Fonctions de base du jeu (inchangées) ---
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function createDiv(type) {
    let div = document.createElement("div");
    div.className = type;
    gameArea.appendChild(div);
    return div;
}

function drawSnake() {
    gameArea.innerHTML = ""; // On nettoie le plateau

    snake.forEach((segment, index) => {
        let snakePart = createDiv("snake-unit"); // Classe de base
        
        // Positionnement
        snakePart.style.left = `${segment.x}px`;
        snakePart.style.top = `${segment.y}px`;

        // --- LOGIQUE D'APPARENCE ---
        
        // 1. C'est la TÊTE
        if (index === 0) {
            snakePart.classList.add("snake-head");
            
            // Calcul de la rotation pour que les yeux regardent dans la bonne direction
            // On utilise la variable globale 'direction'
            let rotation = 0;
            if (direction.x === 1) rotation = 90;  // Droite
            if (direction.x === -1) rotation = -90; // Gauche
            if (direction.y === 1) rotation = 180; // Bas
            if (direction.y === -1) rotation = 0;   // Haut
            
            snakePart.style.transform = `rotate(${rotation}deg)`;
        } 
        // 2. C'est la QUEUE
        else if (index === snake.length - 1) {
            snakePart.classList.add("snake-tail");
        } 
        // 3. C'est le CORPS
        else {
            snakePart.classList.add("snake-body");
        }
    });

    // Dessiner la pomme
    let foodDiv = createDiv("food");
    foodDiv.style.left = `${food.x}px`;
    foodDiv.style.top = `${food.y}px`;
}

function moveSnake() {
    // Appliquer au plus une direction de la file par tick
    if (inputQueue.length) {
        direction = inputQueue.shift();
    }

    const head = {
        x: snake[0].x + direction.x * snakeSize,
        y: snake[0].y + direction.y * snakeSize,
    };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        placeFood();
        // Condition de victoire : longueur atteinte (ici, 6 unités)
        if (snake.length >= 6) {
            winLevel();
            return;
        }
    } else {
        snake.pop();
    }

    if (
        head.x < 0 ||
        head.x >= gameSize.width ||
        head.y < 0 ||
        head.y >= gameSize.height ||
        snake.some(
            (segment, index) =>
            index !== 0 && segment.x === head.x && segment.y === head.y
        )
    ) {
        // Game over : réinitialiser partie
        snake = [{ x: 150, y: 150 }];
        direction = { x: 0, y: 0 };
        // Réinitialiser la vitesse par défaut
        gameSpeed = 200;
        updateSpeedDisplay(); // Mettre à jour l'affichage
        startGameInterval(gameSpeed);
        alert("Game over");
    }
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * (gameSize.width / snakeSize)) * snakeSize,
        y: Math.floor(Math.random() * (gameSize.height / snakeSize)) * snakeSize,
    };
}

const inputQueue = [];

document.addEventListener("keydown", (e) => {
    let newDir = null;
    switch (e.key) {
        case "ArrowDown": newDir = { x: 0, y: 1 }; break;
        case "ArrowUp": newDir = { x: 0, y: -1 }; break;
        case "ArrowRight": newDir = { x: 1, y: 0 }; break;
        case "ArrowLeft": newDir = { x: -1, y: 0 }; break;
    }
    if (!newDir) return;

    const lastDir = inputQueue.length ? inputQueue[inputQueue.length - 1] : direction;
    if (newDir.x === -lastDir.x && newDir.y === -lastDir.y) return;
    if (inputQueue.length < 2) inputQueue.push(newDir);
});

function updateSpeedDisplay() {
    currentSpeedDisplay.textContent = `Vitesse: ${gameSpeed} ms`;
}

function startGameInterval(speed) {
    clearInterval(gameInterval); // Efface l'ancien intervalle s'il existe
    gameInterval = setInterval(() => {
        moveSnake();
        drawSnake();
    }, speed);
}

function changeSpeed(percentageChange) {
    const step = Math.round(gameSpeed * percentageChange);
    let newSpeed = gameSpeed + step;
    newSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, newSpeed));
    gameSpeed = newSpeed;
    updateSpeedDisplay();
    startGameInterval(gameSpeed);
}


// Événements pour les boutons de vitesse
speedUpBtn.addEventListener('click', () => {
    // ACCÉLÉRER: Diminuer le délai (intervalle) de 20%.
    // Cela signifie que le changement doit être NÉGATIF pour diminuer gameSpeed.
    changeSpeed(-0.20); 
});

speedDownBtn.addEventListener('click', () => {
    // RALENTIR: Augmenter le délai (intervalle) de 20%.
    // Cela signifie que le changement doit être POSITIF pour augmenter gameSpeed.
    changeSpeed(0.20);
});


// Initialisation
placeFood();
drawSnake();
updateSpeedDisplay(); // Afficher la vitesse initiale
startGameInterval(gameSpeed); // Démarre le jeu initialement