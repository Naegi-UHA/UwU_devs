let score = 0;
let lives = 3;
let bonusCount = 0;

const scoreDisplay = document.getElementById("score");
const gameArea = document.getElementById("game-area");
const livesDisplay = document.getElementById("lives");
const gameOverScreen = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const bestScoreDisplay = document.getElementById("best-score");

let canShoot = true;
let rapidFire = false;
let cursorX = 0, cursorY = 0;

document.addEventListener("mousemove", (e) => {
    cursorX = e.pageX;
    cursorY = e.pageY;
});

document.getElementById("start-btn").addEventListener("click", () => {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    updateLives();
    startGame();
});

document.getElementById("restart-btn").addEventListener("click", () => {
    location.reload();
});

document.addEventListener("mousedown", (e) => {
    if (canShoot) {
        fireBullet(e.pageX, e.pageY);
        canShoot = false;
        setTimeout(() => { canShoot = true; }, rapidFire ? 100 : 400);
    }
});

function fireBullet(x, y) {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = x - 5 + "px";
    bullet.style.top = y - 20 + "px";
    document.body.appendChild(bullet);

    const moveBullet = setInterval(() => {
        bullet.style.top = bullet.offsetTop - 10 + "px";
        const bulletRect = bullet.getBoundingClientRect();

        document.querySelectorAll(".enemy, .boss").forEach(e => {
            const rect = e.getBoundingClientRect();
            if (!(bulletRect.right < rect.left || bulletRect.left > rect.right ||
                bulletRect.bottom < rect.top || bulletRect.top > rect.bottom)) {

                score += e.classList.contains("boss") ? 10 : 1;
                scoreDisplay.textContent = "Score: " + score;

                e.classList.add("enemy-hit");
                setTimeout(() => { e.remove(); }, 400);

                bullet.remove();
                clearInterval(moveBullet);

                if (score % 20 === 0 && score > 0) {
                    triggerUWU();
                }
            }
        });


        if (bullet.offsetTop < 0) {
            bullet.remove();
            clearInterval(moveBullet);
        }
    }, 30);
}

function startGame() {
    setInterval(() => {
        const entity = document.createElement("div");

        if (score > 0 && score % 15 === 0) {
            entity.classList.add("boss");
        } else if (Math.random() < 0.1) {
            entity.classList.add("bonus");
        } else {
            entity.classList.add("enemy");
        }

        entity.style.left = Math.random() * (window.innerWidth - 100) + "px";
        entity.style.top = "0px";
        gameArea.appendChild(entity);

        const moveEntity = setInterval(() => {
            const speed = Math.floor(2 * Math.pow(1 + score / 50, 1.5));
            entity.style.top = entity.offsetTop + speed + "px";

            if (entity.classList.contains("bonus")) {
                const entityRect = entity.getBoundingClientRect();
                if (cursorX >= entityRect.left && cursorX <= entityRect.right &&
                    cursorY >= entityRect.top && cursorY <= entityRect.bottom) {

                    bonusCount++;
                    rapidFire = true;

                    setTimeout(() => {
                        bonusCount--;
                        if (bonusCount <= 0) {
                            rapidFire = false;
                            bonusCount = 0;
                        }
                    }, 10000);

                    triggerBonusBanner();
                    entity.remove();
                    clearInterval(moveEntity);
                }
            }


            if (entity.offsetTop > window.innerHeight) {
                entity.remove();
                clearInterval(moveEntity);
                if (entity.classList.contains("enemy") || entity.classList.contains("boss")) {
                    lives--;
                    updateLives();
                    if (lives <= 0) {
                        showGameOver();
                    }
                }
            }
        }, 30);
    }, 1000);
}

function updateLives() {
    livesDisplay.innerHTML = "";
    for (let i = 0; i < lives; i++) {
        const life = document.createElement("div");
        life.classList.add("life-icon");
        livesDisplay.appendChild(life);
    }
}

function showGameOver() {
    document.getElementById("game").classList.add("hidden");
    gameOverScreen.classList.remove("hidden");
    gameOverScreen.classList.add("active");

    finalScoreDisplay.textContent = "Your Score: " + score;

    let bestScore = localStorage.getItem("bestScore") || 0;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
    }
    bestScoreDisplay.textContent = "Best Record: " + bestScore;
}

document.addEventListener("keydown", (e) => {
    if (gameOverScreen.classList.contains("active") && e.key === "Enter") {
        location.reload();
    }
});

function triggerUWU() {
    const uwuBanner = document.getElementById("uwu-banner");
    uwuBanner.classList.add("show");

    setTimeout(() => {
        uwuBanner.classList.remove("show");
    }, 3000);
}

function triggerBonusBanner() {
    const bonusBanner = document.getElementById("bonus-banner");
    bonusBanner.classList.add("show");

    setTimeout(() => {
        bonusBanner.classList.remove("show");
    }, 2000);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (!document.getElementById("menu").classList.contains("hidden")) {
            document.getElementById("menu").classList.add("hidden");
            document.getElementById("game").classList.remove("hidden");
            updateLives();
            startGame();
        }

        if (gameOverScreen.classList.contains("active")) {
            location.reload();
        }
    }
});

scoreDisplay.textContent = "Score: " + score;
scoreDisplay.classList.add("score-update");
setTimeout(() => scoreDisplay.classList.remove("score-update"), 300);
