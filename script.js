const noteContainer = document.getElementById('note-container');
const scoreElement = document.getElementById('score-value');
const piano = document.getElementById('piano');
let score = 0;

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
    audio.playbackRate = 2.0; // Vous pouvez ajuster cette valeur (2.0 = deux fois plus rapide)
});

function createFallingLetter() {
    const keys = Object.keys(keyMap);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    
    const letterElement = document.createElement('div');
    letterElement.className = 'falling-note';
    letterElement.textContent = randomKey.toUpperCase();
    letterElement.dataset.key = randomKey;
    
    // Aligner avec les touches du piano
    const pianoKey = document.querySelector(`[data-note="${keyMap[randomKey]}"]`);
    const keyRect = pianoKey.getBoundingClientRect();
    letterElement.style.left = (keyRect.left + keyRect.width/2 - 15) + 'px';
    
    noteContainer.appendChild(letterElement);
    
    letterElement.addEventListener('animationend', () => {
        letterElement.remove();
        score = Math.max(0, score - 10);
        scoreElement.textContent = score;
    });
}

document.addEventListener('keydown', (event) => {
    const pressedKey = event.key.toLowerCase();
    if (keyMap[pressedKey]) {
        const pianoKey = document.querySelector(`[data-note="${keyMap[pressedKey]}"]`);
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
                }
            }
        });
        
        const note = keyMap[pressedKey];
        // Jouer le son
        notes[note].currentTime = 0;
        notes[note].playbackRate = 2.0;
        notes[note].play();
    }
});

document.addEventListener('keyup', (event) => {
    const pressedKey = event.key.toLowerCase();
    if (keyMap[pressedKey]) {
        const pianoKey = document.querySelector(`[data-note="${keyMap[pressedKey]}"]`);
        pianoKey.classList.remove('active');
    }
});

// Créer une nouvelle lettre toutes les 2 secondes
setInterval(createFallingLetter, 1000);
