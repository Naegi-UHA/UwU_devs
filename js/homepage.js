// Smooth scroll on nav & buttons with data-scroll
document.querySelectorAll('a[href^="#"], [data-scroll]').forEach(el => {
    el.addEventListener('click', e => {
        const targetSelector = el.getAttribute('href')?.startsWith('#')
            ? el.getAttribute('href')
            : el.getAttribute('data-scroll');

        if (!targetSelector || targetSelector === '#') return;

        const target = document.querySelector(targetSelector);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Diagnostic express
const diagChecks = document.querySelectorAll('.diag-check');
const diagScoreEl = document.getElementById('diagScore');
const diagMessage = document.getElementById('diagMessage');

// Fiole liée au diagnostic
const flaskContainer = document.getElementById('diagFlask');
const flaskLiquid = document.getElementById('diagLiquid');

const gauloisCheck = document.getElementById('gauloisCheck');


function updateDiagnostic() {
    let score = 0;
    let maxScore = 0;

    diagChecks.forEach(chk => {
        const weight = Number(chk.dataset.weight || 1);
        maxScore += weight;
        if (chk.checked) score += weight;
    });

    const ratio = maxScore > 0 ? score / maxScore : 0;

    // Légère “ease” pour que visuellement ça soit plus régulier
    const eased = Math.pow(ratio, 1.15);
    let level = Math.max(0, Math.min(1, eased)); // 0 → 1

    // Affichage score
    diagScoreEl.textContent = `${score}`;

    // Texte d'interprétation (mode normal)
    if (score === 0) {
        diagMessage.textContent =
            "Vous êtes peut-être déjà un village très résistant… ou vous n'avez encore rien coché 😉";
    } else if (score <= maxScore / 3) {
        diagMessage.textContent =
            "Belle base ! Vous avez déjà une marge d'autonomie intéressante. Explorez les étapes 3 à 5 pour aller plus loin.";
    } else if (score <= (2 * maxScore) / 3) {
        diagMessage.textContent =
            "Votre village est en transition : certaines briques sont encore très dépendantes. Priorisez les urgences avec l'étape 2.";
    } else {
        diagMessage.textContent =
            "Goliath a encore beaucoup de pouvoir. Commencez par cartographier vos usages (étape 1) et sécuriser les données critiques.";
    }

    // --------- MODE IRRÉDUCTIBLE GAULOIS ---------
    let gauloisMode = gauloisCheck && gauloisCheck.checked;
    if (gauloisMode) {
        level = 1;
        diagMessage.textContent =
            "Vous revendiquez un village irréductible : la potion est déjà prête, reste à la partager 😉";
    }


    // --------- Mise à jour de la fiole ---------
    if (flaskLiquid && flaskContainer) {
        // level ∈ [0,1] → var CSS découpe de la partie haute
        const cut = (1 - level) * 100;
        flaskLiquid.style.setProperty('--liquid-cut', `${cut}%`);

        // Couleur spéciale si Gaulois
        if (gauloisMode) {
            flaskContainer.classList.add('gaulois');
        } else {
            flaskContainer.classList.remove('gaulois');
        }

        if (level >= 1) {
            flaskContainer.classList.add('full');
        } else {
            flaskContainer.classList.remove('full');
        }
    }
}


// Quand on clique sur "irréductible Gaulois"
if (gauloisCheck) {
    gauloisCheck.addEventListener('change', () => {
        if (gauloisCheck.checked) {
            // Si des cases sont déjà cochées, on les efface
            const hasOther = Array.from(diagChecks).some(c => c.checked);
            if (hasOther) {
                magicAlert("⚠️ Potion instable !", 
                    "On ne peut pas être un irréductible Gaulois si des faiblesses sont cochées."
                );
                gauloisCheck.checked = false;   // on annule ce clic
            }
        }
        updateDiagnostic();
    });
}

// Quand on clique sur une case normale
diagChecks.forEach(chk => {
    chk.addEventListener('change', () => {
        if (gauloisCheck && gauloisCheck.checked && chk.checked) {
            // gaulois est déjà actif, on bloque la nouvelle case
            magicAlert("⚔️ Contradiction gauloise !",
                "Décochez la potion magique avant de déclarer une faiblesse."
            );
            chk.checked = false;   // on annule ce clic
            return;
        }
        updateDiagnostic();
    });
});

// Premier calcul au chargement
updateDiagnostic();



// Clic sur la fiole quand elle est pleine → flash + shake + redirection NIRD
if (flaskContainer) {
    flaskContainer.addEventListener('click', () => {
        if (!flaskContainer.classList.contains('full')) return;

        flaskContainer.classList.add('flash', 'shake');
        setTimeout(() => {
            flaskContainer.classList.remove('flash', 'shake');
        }, 650);

        setTimeout(() => {
            window.open('https://nird.forge.apps.education.fr/', '_blank');
        }, 500);
    });
}

// Parcours NIRD : ouverture/fermeture des cartes
const stepCards = document.querySelectorAll('.step-card');

stepCards.forEach(card => {
    card.addEventListener('click', () => {
        stepCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
});

// Toggle thème clair / sombre (sobriété)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        themeToggle.textContent = next === 'dark' ? '🌙 Sobriété' : '💡 Sobriété';
    });
}

function magicAlert(title, message) {
    // supprime une alerte existante
    const old = document.querySelector(".flash-alert-overlay");
    if (old) old.remove();

    // conteneur
    const overlay = document.createElement("div");
    overlay.className = "flash-alert-overlay";

    // boîte
    const box = document.createElement("div");
    box.className = "flash-alert alert-shake alert-flash";


    box.innerHTML = `
        <h2>${title}</h2>
        <p>${message}</p>
        <button>OK</button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // fermeture
    overlay.querySelector("button").addEventListener("click", () => {
        overlay.remove();
    });
}