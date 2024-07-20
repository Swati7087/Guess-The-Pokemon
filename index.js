let gameData;
const main = document.querySelector('main');
const pokemonImage = document.querySelector('#pokemon-image');
const textOverlay = document.querySelector('#text-overlay');
const choices = document.querySelector('#choices');
const playBtn = document.querySelector('#play');

playBtn.addEventListener('click', fetchData);

function loadVoice() {
  window.speechSynthesis.onvoiceschanged = () => {
    const voices = speechSynthesis.getVoices();
    console.log('Available voices:', voices);
    window.femaleVoice = voices.find(voice => voice.name.includes('Female')) || voices[0];
    console.log('Selected voice:', window.femaleVoice);
  };
}

function addAnswerHandler() {
  choices.addEventListener('click', e => {
    if (!e.target.dataset.name) return;
    const { name } = e.target.dataset;
    const resultClass = (name === gameData.correct.name) ? 'correct' : 'incorrect';
    e.target.classList.add(resultClass);
    revealPokemon();
    speakAnswer();
  });
}

async function fetchData() {
  try {
    resetImage();
    gameData = await window.getPokeData();
    console.log('Fetched game data:', gameData);
    showSilhouette();
    displayChoices();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function resetImage() {
  pokemonImage.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';
  main.classList.add('fetching');
  main.classList.remove('revealed');
}

function showSilhouette() {
  main.classList.remove('fetching');
  pokemonImage.src = gameData.correct.image;
}

function displayChoices() {
  const { pokemonChoices } = gameData;
  const choicesHTML = pokemonChoices.map(({ name }) => {
    return `<button data-name="${name}">${name}</button>`;
  }).join('');

  choices.innerHTML = choicesHTML;
}

function revealPokemon() {
  main.classList.add('revealed');
  textOverlay.textContent = `${gameData.correct.name}!`;
}

function speakAnswer() {
  const utterance = new SpeechSynthesisUtterance(gameData.correct.name);
  utterance.voice = window.femaleVoice;
  utterance.pitch = 0.9;
  utterance.rate = 0.85;
  speechSynthesis.speak(utterance);
}

// Initialize the voice and answer handler
loadVoice();
addAnswerHandler();

