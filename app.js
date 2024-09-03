// Game configuration
const words = 'The sun was setting and the sky was painted in soft colors of orange and pink the air was warm but a gentle breeze made it feel pleasant people were walking slowly on the streets some were heading home while others just enjoyed the calm evening a few kids were playing in the park laughing and running around carefree the trees swayed slightly as the wind moved through the leaves making a soft rustling sound a couple sat on a bench sharing quiet conversation and watching the sky change its colors in the distance the sound of a car engine hummed softly a dog barked a few times before settling down'.split(' ');

const wordscount = words.length;
const gametime = 30 * 1000; // 30 seconds in milliseconds
let timer = null;
let timeRemaining = gametime; // Time left in the game
let correctWordsCount = 0; // Counter for correctly typed words
let intervalWords = 0; // Words typed in the current interval
let interval = 5000; // Time interval in milliseconds for speed tracking

// Function to generate a random word from the list
function randomword() {
    const randomindex = Math.floor(Math.random() * wordscount);
    return words[randomindex];
}

// Utility functions to add and remove classes
function addclass(el, name) {
    el.className += ' ' + name;
}

function removeclass(el, name) {
    el.className = el.className.replace(new RegExp(`\\b${name}\\b`, 'g'), '').trim();
}

// Function to start a new game
function newgame() {
    const wordsContainer = document.getElementById('words');
    wordsContainer.innerHTML = '';
    document.getElementById('wpm-display').textContent = ''; // Clear previous WPM display
    document.getElementById('speed-message').style.display = 'none'; // Hide speed message
    timeRemaining = gametime;
    updateTimerDisplay(gametime / 1000); // Reset timer display
    correctWordsCount = 0; // Reset correct words count
    intervalWords = 0; // Reset interval word count

    // Stop any ongoing timer
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    // Generate a random sequence of words for the paragraph
    const randomWords = Array.from({ length: 50 }, randomword).join(' ');

    // Create a paragraph element and set its text content
    const paragraph = document.createElement('p');
    paragraph.className = 'paragraph';

    // Split the random words into spans
    randomWords.split(' ').forEach((wordText) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';

        // Split each word into letters
        for (let char of wordText) {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'letter';
            letterSpan.textContent = char;
            wordSpan.appendChild(letterSpan);
        }

        paragraph.appendChild(wordSpan);
        paragraph.appendChild(document.createTextNode(' ')); // Add space between words
    });

    wordsContainer.appendChild(paragraph);

    // Add the 'current' class to the first letter of the first word
    const firstLetter = document.querySelector('.letter');
    if (firstLetter) addclass(firstLetter, 'current');

    // Re-attach event listener for keyup
    document.getElementById('game').removeEventListener('keyup', handleKeyPress);
    document.getElementById('game').addEventListener('keyup', handleKeyPress);
}

// Updates the timer display
function updateTimerDisplay(seconds) {
    document.getElementById('info').textContent = seconds;
}

// Starts the countdown timer
function startTimer() {
    timer = setInterval(() => {
        timeRemaining -= 1000;
        updateTimerDisplay(timeRemaining / 1000);

        // Every interval (e.g., 5 seconds), record the number of typed words
        if (timeRemaining % interval === 0) {
            intervalWords = 0; // Reset interval word count
        }

        // End the game when the timer reaches zero
        if (timeRemaining <= 0) {
            clearInterval(timer);
            timer = null;
            endGame();
        }
    }, 1000);
}

// End the game, disable further input, and calculate WPM
function endGame() {
    document.getElementById('game').removeEventListener('keyup', handleKeyPress);
    displayWPM(); // Show WPM when the game ends
    displaySpeedMessage(); // Display speed message
}

// Calculate and display words per minute (WPM)
function displayWPM() {
    const wpm = Math.round((correctWordsCount / (gametime / 60000)));
    const wpmDisplay = document.getElementById('wpm-display');
    wpmDisplay.textContent = `Your speed is ${wpm} words per minute`;
}




// Focus event handler to hide the focus error message
document.getElementById('game').addEventListener('focus', () => {
    document.getElementById('focus-error').style.display = 'none';
});

// Blur event handler to show the focus error message when losing focus
document.getElementById('game').addEventListener('blur', () => {
    document.getElementById('focus-error').style.display = 'block';
});

// Handles the key press event
function handleKeyPress(ev) {
    const key = ev.key;
    const currentLetter = document.querySelector('.letter.current');
    const isLetter = key.length === 1; // Checks if the key is a single character

    // Start the timer on the first key press
    if (!timer && isLetter) {
        startTimer();
    }

    // Check if the currentLetter exists and the pressed key is a single character
    if (!currentLetter || !isLetter) return;

    const expected = currentLetter.textContent;

    // Compare the pressed key with the expected character, ignoring case sensitivity
    if (key.toLowerCase() === expected.toLowerCase()) {
        removeclass(currentLetter, 'current');
        currentLetter.style.color = 'green'; // Visual feedback for correct input
        const nextLetter = currentLetter.nextElementSibling;

        // Move to the next letter or word
        if (nextLetter && nextLetter.classList.contains('letter')) {
            addclass(nextLetter, 'current');
        } else {
            // Move to the next word if no more letters in the current word
            const currentWord = currentLetter.parentElement;
            const nextWord = currentWord.nextElementSibling;

            if (nextWord && nextWord.classList.contains('word')) {
                addclass(nextWord.querySelector('.letter'), 'current');
                correctWordsCount++; // Increment the correct words count when a word is completed
                intervalWords++; // Increment interval word count for speed tracking
            }
        }
    } else {
        // Handle wrong key press
        currentLetter.style.color = 'red'; // Visual feedback for incorrect input
    }
}

// Start a new game on initial load
newgame();
