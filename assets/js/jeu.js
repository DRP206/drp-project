// jeu.js - Version avec sons
document.addEventListener('DOMContentLoaded', () => {
    // Constantes
    const CHOIX = {
        PIERRE: 'pierre',
        FEUILLE: 'feuille',
        CISEAUX: 'ciseaux'
    };

    // Éléments DOM
    const elements = {
        boutons: document.querySelectorAll('.choice-btn'),
        resultat: document.getElementById('round-result'),
        scoreJoueur: document.getElementById('player-score'),
        scoreOrdinateur: document.getElementById('computer-score'),
        btnReset: document.getElementById('reset-btn'),
        historique: document.createElement('div')
    };

    // Sons
    const sounds = {
        win: new Audio('win.mp3'),
        lose: new Audio('lose.mp3'),
        draw: new Audio('draw.mp3')
    };

    // Variables d'état
    let scores = {
        joueur: 0,
        ordinateur: 0
    };

    // Initialisation
    function init() {
        // Précharge les sons (optionnel)
        Object.values(sounds).forEach(sound => {
            sound.preload = 'auto';
            sound.volume = 0.7; // Volume à 70%
        });

        // Setup historique
        elements.historique.id = 'game-history';
        elements.historique.style.marginTop = '20px';
        elements.resultat.insertAdjacentElement('afterend', elements.historique);

        // Événements
        elements.boutons.forEach(btn => {
            btn.addEventListener('click', () => {
                const choixJoueur = btn.dataset.choice;
                jouerManche(choixJoueur);
                animerChoix(btn);
            });
        });

        elements.btnReset.addEventListener('click', reinitialiserJeu);
    }

    // Logique principale
    function jouerManche(choixJoueur) {
        const choixOrdinateur = genererChoixOrdinateur();
        const resultat = determinerResultat(choixJoueur, choixOrdinateur);

        // Joue le son correspondant
        jouerSon(resultat);

        // Mise à jour UI
        afficherResultat(choixJoueur, choixOrdinateur, resultat);
        mettreAJourScores(resultat);
        ajouterHistorique(choixJoueur, choixOrdinateur, resultat);

        // Fin de partie à 5 points
        if (Math.max(scores.joueur, scores.ordinateur) >= 5) {
            finDePartie();
        }
    }

    // Nouvelle fonction pour gérer les sons
    function jouerSon(resultat) {
        const soundMap = {
            'victoire': sounds.win,
            'défaite': sounds.lose,
            'égalité': sounds.draw
        };

        // Réinitialise et joue le son
        const sound = soundMap[resultat];
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Le son n'a pas pu être joué:", e));
    }

    // Fonctions utilitaires (gardées identiques)
    function genererChoixOrdinateur() {
        const choix = Object.values(CHOIX);
        return choix[Math.floor(Math.random() * choix.length)];
    }

    function determinerResultat(joueur, ordinateur) {
        if (joueur === ordinateur) return 'égalité';
        
        const regles = {
            [CHOIX.PIERRE]: CHOIX.CISEAUX,
            [CHOIX.FEUILLE]: CHOIX.PIERRE,
            [CHOIX.CISEAUX]: CHOIX.FEUILLE
        };

        return regles[joueur] === ordinateur ? 'victoire' : 'défaite';
    }

    function animerChoix(bouton) {
        bouton.classList.add('bounce');
        setTimeout(() => bouton.classList.remove('bounce'), 500);
    }

    // Gestion de l'interface (identique)
    function afficherResultat(joueur, ordinateur, resultat) {
        const messages = {
            victoire: `Vous gagnez ! ${joueur} bat ${ordinateur}`,
            défaite: `Vous perdez... ${ordinateur} bat ${joueur}`,
            égalité: `Égalité ! ${joueur} vs ${ordinateur}`
        };

        elements.resultat.textContent = messages[resultat];
        elements.resultat.className = resultat;
    }

    function mettreAJourScores(resultat) {
        if (resultat === 'victoire') scores.joueur++;
        if (resultat === 'défaite') scores.ordinateur++;
        
        elements.scoreJoueur.textContent = scores.joueur;
        elements.scoreOrdinateur.textContent = scores.ordinateur;
    }

    function ajouterHistorique(joueur, ordinateur, resultat) {
        const emojis = {
            [CHOIX.PIERRE]: '✊',
            [CHOIX.FEUILLE]: '✋',
            [CHOIX.CISEAUX]: '✌️'
        };

        const entry = document.createElement('div');
        entry.innerHTML = `
            <span>${emojis[joueur]} vs ${emojis[ordinateur]}</span>
            <span class="badge ${resultat}">${resultat.toUpperCase()}</span>
        `;
        elements.historique.prepend(entry);
    }

    function finDePartie() {
        const gagnant = scores.joueur > scores.ordinateur ? 'joueur' : 'ordinateur';
        
        // Joue un son spécial pour la fin de partie
        const finalSound = gagnant === 'joueur' ? sounds.win : sounds.lose;
        finalSound.currentTime = 0;
        finalSound.play();

        elements.resultat.textContent = `Partie terminée ! Vous avez ${gagnant === 'joueur' ? 'gagné' : 'perdu'} 5 à ${scores[gagnant === 'joueur' ? 'ordinateur' : 'joueur']}`;
        elements.boutons.forEach(btn => btn.disabled = true);
    }

    function reinitialiserJeu() {
        scores = { joueur: 0, ordinateur: 0 };
        elements.scoreJoueur.textContent = '0';
        elements.scoreOrdinateur.textContent = '0';
        elements.resultat.textContent = 'Faites votre choix !';
        elements.resultat.className = '';
        elements.historique.innerHTML = '';
        elements.boutons.forEach(btn => btn.disabled = false);
    }

    // Lancement
    init();
});