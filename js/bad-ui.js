document.addEventListener("DOMContentLoaded", () => {
            
    // --- LOGIQUE METIER ---
    const rouletteBox = document.getElementById('roulette-box');
    const btnStop = document.getElementById('btn-stop');
    const btnDelete = document.getElementById('btn-delete');
    const allInputs = document.querySelectorAll('.field');
    const wrapperStop = document.getElementById('wrapper-stop');
    const wrapperDelete = document.getElementById('wrapper-delete');

    let currentInput = null;

    allInputs.forEach(input => {
        input.addEventListener('click', (e) => {
            e.stopPropagation(); 
            allInputs.forEach(i => i.classList.remove('active'));
            input.classList.add('active');
            currentInput = input;
        });
    });

    // --- ICI : AJOUT DES MINUSCULES ---
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ- ";
    let charArray = chars.split('');
    
    function loopRoulette() {
        const randomIndex = Math.floor(Math.random() * charArray.length);
        rouletteBox.innerText = charArray[randomIndex];
        setTimeout(loopRoulette, Math.random() * 300 + 50);
    }
    loopRoulette();

    // --- SWAP LOGIC ---
    function swapButtonsPosition() {
        const objStop = physicsObjects.find(obj => obj.element === wrapperStop);
        const objDelete = physicsObjects.find(obj => obj.element === wrapperDelete);

        if (objStop && objDelete) {
            let tempX = objStop.x;
            objStop.x = objDelete.x;
            objDelete.x = tempX;

            let tempY = objStop.y;
            objStop.y = objDelete.y;
            objDelete.y = tempY;

            objStop.element.style.left = objStop.x + 'px';
            objStop.element.style.top = objStop.y + 'px';
            objDelete.element.style.left = objDelete.x + 'px';
            objDelete.element.style.top = objDelete.y + 'px';
        }
    }

    btnStop.addEventListener('click', (e) => {
        e.stopPropagation(); 
        if(currentInput) currentInput.value += rouletteBox.innerText;
        swapButtonsPosition();
    });

    btnDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        if(currentInput) currentInput.value = currentInput.value.slice(0, -1);
        swapButtonsPosition();
    });


    // --- MOTEUR PHYSIQUE ---
    
    const movables = document.querySelectorAll('.movable');
    const physicsObjects = []; 

    movables.forEach(el => {
        let vx = (Math.random() - 0.5) * 1.5; 
        let vy = (Math.random() - 0.5) * 1.5;
        
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
            obj.x += obj.vx;
            obj.y += obj.vy;

            if (obj.cooldown > 0) obj.cooldown--;

            if (obj.x <= 0 || obj.x + obj.width >= screenW) {
                obj.vx *= -1; 
                obj.x = Math.max(0, Math.min(obj.x, screenW - obj.width));
            }
            if (obj.y <= 0 || obj.y + obj.height >= screenH) {
                obj.vy *= -1; 
                obj.y = Math.max(0, Math.min(obj.y, screenH - obj.height));
            }
        });

        for (let i = 0; i < physicsObjects.length; i++) {
            for (let j = i + 1; j < physicsObjects.length; j++) {
                const objA = physicsObjects[i];
                const objB = physicsObjects[j];

                if (objA.cooldown === 0 && objB.cooldown === 0) {
                    if (checkRectCollision(objA, objB)) {
                        let tempVx = objA.vx;
                        let tempVy = objA.vy;
                        objA.vx = objB.vx;
                        objA.vy = objB.vy;
                        objB.vx = tempVx;
                        objB.vy = tempVy;
                        objA.cooldown = 10; 
                        objB.cooldown = 10;
                    }
                }
            }
        }

        physicsObjects.forEach(obj => {
            obj.element.style.left = obj.x + 'px';
            obj.element.style.top = obj.y + 'px';
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

});