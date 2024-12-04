const noteContainer = document.getElementById('note-container');
const scoreElement = document.getElementById('score-value');
const piano = document.getElementById('piano');
let score = 0;

// Les différentes mélodies
const melodies = {
    'frere-jacques': {
        name: 'Frère Jacques',
        notes: [
            'C', 'D', 'E', 'C',    // Frè-re Jac-ques
            'C', 'D', 'E', 'C',    // Frè-re Jac-ques
            'E', 'F', 'G',         // Dor-mez-vous?
            'E', 'F', 'G'          // Dor-mez-vous?
        ]
    },
    'au-clair-lune': {
        name: 'Au Clair de la Lune',
        notes: [
            'C', 'C', 'C', 'D',    // Au clair de la
            'E', 'D', 'C', 'E',    // lune, mon a-
            'D', 'D', 'C'          // mi Pier-rot
        ]
    },
    'petit-mouton': {
        name: 'Petit Mouton',
        notes: [
            'C', 'C', 'G', 'G',    // Do do sol sol
            'A', 'A', 'G',         // la la sol
            'F', 'F', 'E', 'E',    // fa fa mi mi
            'D', 'D', 'C'          // ré ré do
        ]
    }
};

let currentMelody = null;
let melodyIndex = 0;
let gameInterval = null;
let repetitionCount = 0; // Compte le nombre de répétitions
const maxRepetitions = 2; // Nombre maximum de répétitions

// Mapping des touches aux notes
const keyMap = {
    'a': 'C',
    'w': 'C#',
    's': 'D',
    'e': 'D#',
    'd': 'E',
    'f': 'F',
    't': 'F#',
    'g': 'G',
    'y': 'G#',
    'h': 'A',
    'u': 'A#',
    'j': 'B'
};

// Créer les objets Audio pour chaque note
const notes = {
    'C': new Audio('sounds/do-80236.mp3'),
    'C#': new Audio('sounds/sound-note-c-stretched.mp3'),
    'D': new Audio('sounds/re-78500.mp3'),
    'D#': new Audio('sounds/the-sound-of-the-note-a-is-stretched.mp3'),
    'E': new Audio('sounds/mi-80239.mp3'),
    'F': new Audio('sounds/fa-78409.mp3'),
    'F#': new Audio('sounds/the-sound-of-the-note-fa-is-stretched.mp3'),
    'G': new Audio('sounds/sol-101774.mp3'),
    'G#': new Audio('sounds/the-sound-of-the-note-sol-extended (1).mp3'),
    'A': new Audio('sounds/la-80237.mp3'),
    'A#': new Audio('sounds/the-sound-of-the-note-mi-is-stretched.mp3'),
    'B': new Audio('sounds/si-80238.mp3')
};

// Configurer la vitesse de lecture pour chaque son
Object.values(notes).forEach(audio => {
    audio.playbackRate = 4.0;
});

// Gestionnaire de sélection de mélodie
document.querySelectorAll('#melody-selection button').forEach(button => {
    button.addEventListener('click', () => {
        const melodyKey = button.dataset.melody;
        currentMelody = melodies[melodyKey].notes;
        melodyIndex = 0;
        repetitionCount = 0; // Réinitialiser les répétitions
        
        // Cacher le menu et montrer le jeu
        document.getElementById('melody-selection').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        
        // Démarrer le jeu
        gameInterval = setInterval(createFallingLetter, 750);
    });
});

function createFallingLetter() {
    if (!currentMelody) return;
    
    const note = currentMelody[melodyIndex % currentMelody.length];
    const keyToPress = Object.keys(keyMap).find(key => keyMap[key] === note);
    
    const letterElement = document.createElement('div');
    letterElement.className = 'falling-note';
    letterElement.textContent = keyToPress.toUpperCase();
    letterElement.dataset.key = keyToPress;
    letterElement.dataset.note = note;
    
    const pianoKey = document.querySelector(`[data-note="${note}"]`);
    const keyRect = pianoKey.getBoundingClientRect();
    letterElement.style.left = (keyRect.left + keyRect.width / 2 - 15) + 'px';
    
    noteContainer.appendChild(letterElement);
    
    letterElement.addEventListener('animationend', () => {
        letterElement.remove();
        score = Math.max(0, score - 10);
        scoreElement.textContent = score;
        melodyIndex = 0; // Réinitialiser la mélodie si on rate une note
    });
}

document.addEventListener('keydown', (event) => {
    const pressedKey = event.key.toLowerCase();
    if (keyMap[pressedKey]) {
        const note = keyMap[pressedKey];
        const pianoKey = document.querySelector(`[data-note="${note}"]`);
        pianoKey.classList.add('active');
        
        const fallingLetters = document.querySelectorAll('.falling-note');
        fallingLetters.forEach(letter => {
            if (letter.dataset.key === pressedKey) {
                const rect = letter.getBoundingClientRect();
                const pianoRect = piano.getBoundingClientRect();
                
                if (rect.bottom > pianoRect.top - 50 && rect.bottom < pianoRect.top + 50) {
                    letter.remove();
                    score += 10;
                    scoreElement.textContent = score;
                    
                    // Jouer le son
                    notes[note].currentTime = 0;
                    notes[note].play();
                    
                    // Avancer dans la mélodie
                    melodyIndex++;
                }
            }
        });
        
        if (melodyIndex >= currentMelody.length) {
            repetitionCount++;
            
            if (repetitionCount < maxRepetitions) {
                melodyIndex = 0; // Réinitialiser pour une nouvelle répétition
            } else {
                // La mélodie est terminée après 3 répétitions
                setTimeout(() => {
                    alert('Bravo ! Mélodie terminée après 3 répétitions !');
                    // Retour au menu de sélection
                    clearInterval(gameInterval);
                    document.getElementById('game-container').style.display = 'none';
                    document.getElementById('melody-selection').style.display = 'block';
                    score = 0;
                    scoreElement.textContent = score;
                    repetitionCount = 0; // Réinitialiser pour la prochaine mélodie
                }, 1000);
            }
        }
    }
});

document.addEventListener('keyup', (event) => {
    const pressedKey = event.key.toLowerCase();
    if (keyMap[pressedKey]) {
        const pianoKey = document.querySelector(`[data-note="${keyMap[pressedKey]}"]`);
        pianoKey.classList.remove('active');
    }
});
