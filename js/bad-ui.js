document.addEventListener("DOMContentLoaded", () => {
            
    // --- 1. SÉLECTION DES ÉLÉMENTS DU DOM ---
    const rouletteBox = document.getElementById('roulette-box');
    const btnStop = document.getElementById('btn-stop');
    const btnDelete = document.getElementById('btn-delete');
    const allInputs = document.querySelectorAll('.field');
    const wrapperStop = document.getElementById('wrapper-stop');
    const wrapperDelete = document.getElementById('wrapper-delete');
    
    // Le message d'alerte (ajouté dans le HTML)
    const alertMessage = document.getElementById('alert-message');

    let currentInput = null;

    // --- 2. GESTION DES CHAMPS (INPUTS) ---
    allInputs.forEach(input => {
        
        // A. Sélectionner le champ au clic
        input.addEventListener('click', (e) => {
            e.stopPropagation(); 
            allInputs.forEach(i => i.classList.remove('active'));
            input.classList.add('active');
            currentInput = input;
        });

        // B. Engueuler l'utilisateur s'il utilise le clavier
        input.addEventListener('keydown', (e) => {
            e.preventDefault(); // Bloque l'écriture
            
            if (alertMessage) {
                // Affiche le message
                alertMessage.style.display = 'block';

                // Le cache après 1.5 secondes
                setTimeout(() => {
                    alertMessage.style.display = 'none';
                }, 1500);
            }
        });
    });

    // --- 3. LA ROULETTE (LETTRES QUI DÉFILENT) ---
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ- ";
    let charArray = chars.split('');
    
    function loopRoulette() {
        const randomIndex = Math.floor(Math.random() * charArray.length);
        rouletteBox.innerText = charArray[randomIndex];
        setTimeout(loopRoulette, Math.random() * 300 + 50);
    }
    loopRoulette();

    // --- 4. MOTEUR PHYSIQUE (INITIALISATION) ---
    const movables = document.querySelectorAll('.movable');
    const physicsObjects = []; 

    movables.forEach(el => {
        let vx = (Math.random() - 0.5) * 1.5; 
        let vy = (Math.random() - 0.5) * 1.5;
        
        // Vitesse minimale pour éviter que ça stagne
        if (Math.abs(vx) < 0.3) vx = 0.5;
        if (Math.abs(vy) < 0.3) vy = 0.5;

        let rect = el.getBoundingClientRect();

        physicsObjects.push({
            element: el,
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            vx: vx,
            vy: vy,
            cooldown: 0
        });
    });

    // --- 5. FONCTIONS LOGIQUES (SWAP & BOUTONS) ---
    
    // Échange la position des boutons Stop et Delete
    function swapButtonsPosition() {
        const objStop = physicsObjects.find(obj => obj.element === wrapperStop);
        const objDelete = physicsObjects.find(obj => obj.element === wrapperDelete);

        if (objStop && objDelete) {
            // Echange X
            let tempX = objStop.x;
            objStop.x = objDelete.x;
            objDelete.x = tempX;

            // Echange Y
            let tempY = objStop.y;
            objStop.y = objDelete.y;
            objDelete.y = tempY;

            // Applique visuellement
            objStop.element.style.left = objStop.x + 'px';
            objStop.element.style.top = objStop.y + 'px';
            objDelete.element.style.left = objDelete.x + 'px';
            objDelete.element.style.top = objDelete.y + 'px';
        }
    }

    // Bouton STOP / AJOUTER
    btnStop.addEventListener('click', (e) => {
        e.stopPropagation(); 
        if(currentInput) {
            currentInput.value += rouletteBox.innerText;
        }
        swapButtonsPosition();
    });

    // Bouton EFFACER
    btnDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        if(currentInput) {
            currentInput.value = currentInput.value.slice(0, -1);
        }
        swapButtonsPosition();
    });

    // --- 6. GESTION DES COLLISIONS ET ANIMATION ---

    function checkRectCollision(rect1, rect2) {
        return (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y);
    }

    function animate() {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        physicsObjects.forEach(obj => {
            // Mouvement
            obj.x += obj.vx;
            obj.y += obj.vy;

            // Cooldown de collision
            if (obj.cooldown > 0) obj.cooldown--;

            // Rebond sur les murs
            if (obj.x <= 0 || obj.x + obj.width >= screenW) {
                obj.vx *= -1; 
                obj.x = Math.max(0, Math.min(obj.x, screenW - obj.width));
            }
            if (obj.y <= 0 || obj.y + obj.height >= screenH) {
                obj.vy *= -1; 
                obj.y = Math.max(0, Math.min(obj.y, screenH - obj.height));
            }
        });

        // Rebond entre objets
        for (let i = 0; i < physicsObjects.length; i++) {
            for (let j = i + 1; j < physicsObjects.length; j++) {
                const objA = physicsObjects[i];
                const objB = physicsObjects[j];

                if (objA.cooldown === 0 && objB.cooldown === 0) {
                    if (checkRectCollision(objA, objB)) {
                        // Echange de vélocité (rebond simple)
                        let tempVx = objA.vx;
                        let tempVy = objA.vy;
                        objA.vx = objB.vx;
                        objA.vy = objB.vy;
                        objB.vx = tempVx;
                        objB.vy = tempVy;
                        
                        // Petit cooldown pour éviter qu'ils se collent
                        objA.cooldown = 10; 
                        objB.cooldown = 10;
                    }
                }
            }
        }

        // Mise à jour visuelle (CSS)
        physicsObjects.forEach(obj => {
            obj.element.style.left = obj.x + 'px';
            obj.element.style.top = obj.y + 'px';
        });

        requestAnimationFrame(animate);
    }

    // Lance l'animation
    requestAnimationFrame(animate);

});