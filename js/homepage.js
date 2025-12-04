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
    const level = Math.max(0, Math.min(1, eased)); // 0 → 1

    // Affichage score
    diagScoreEl.textContent = `${score}`;

    // Texte d'interprétation
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

    if (flaskLiquid && flaskContainer) {

        const cut = (1 - level) * 100;
        flaskLiquid.style.setProperty('--liquid-cut', `${cut}%`);

        if (level >= 1) {
            flaskContainer.classList.add('full');
        } else {
            flaskContainer.classList.remove('full');
        }
    }

}

diagChecks.forEach(chk => chk.addEventListener('change', updateDiagnostic));
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
