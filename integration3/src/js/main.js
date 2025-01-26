import '../css/style.css'

let lastTap = 0;
let isPlaying = false;
let currentIntensityIndex = 0;
let hasLoudEnoughScreamed = false;
let audioContext;
let analyser;
let frequencyData = null;
let detectingSound = false;

const soundIntensityLevels = [
    { level: 30, message: "You are too quiet, your partner doesn't hear you" },
    { level: 60, message: "Try a bit harder!" },
    { level: 100, message: "He heard you, and brought ink!" }
];

const toggleFigureImage = () => {
  const figure = document.querySelector('.figure');
  figure.addEventListener('touchend', (event) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 500 && tapLength > 0) {
          figure.src = figure.src.includes('figure.svg') ? 'assets/figureplantin.png' : 'assets/figure.svg';
      }
      lastTap = currentTime;
  });
};

const toggleMenu = () => {
  const menuToggle = document.querySelector('.header__menu-toggle');
  const menu = document.querySelector('.header__menu');
  menuToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      menuToggle.classList.toggle('active');
  });
};

const validateWord = () => {
  document.querySelector('.go-btn').addEventListener('click', () => {
      let letters = document.querySelectorAll('.letter-input');
      const word = "PLANTIN";
      letters.forEach((input, index) => {
          if (input.value.toUpperCase() === word[index]) {
              input.classList.add('correct');
              input.classList.remove('incorrect', 'yellow');
          } else if (word.includes(input.value.toUpperCase())) {
              input.classList.add('yellow');
              input.classList.remove('incorrect', 'correct');
          } else {
              input.classList.add('incorrect');
              input.classList.remove('correct', 'yellow');
          }
      });
  });
};

const handleAudioToggle = () => {
  document.addEventListener("DOMContentLoaded", () => {
      const audio = document.getElementById("scream-room__audio");
      const iconContainer = document.querySelector(".scream-room__icon-container");
      iconContainer.addEventListener("click", () => {
          if (isPlaying) {
              audio.pause();
              audio.currentTime = 0;
              iconContainer.classList.remove("active");
          } else {
              audio.play();
              iconContainer.classList.add("active");
          }
          isPlaying = !isPlaying;
      });
  });
};

const handleDragDrop = () => {
  const horse = document.getElementById('horse');
  const cities = [document.getElementById('paris'), document.getElementById('antwerp')];
  
  horse.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text', 'horse');
  });
  
  cities.forEach(city => {
      city.addEventListener('dragover', (e) => e.preventDefault());
      city.addEventListener('drop', (e) => {
          e.preventDefault();
          if (e.dataTransfer.getData('text') === 'horse') {
              cities.forEach(c => c.style.display = 'none');
              city.classList.add('expanded');
              city.style.display = 'block';
          }
      });
  });
};

const updateSoundMessage = (intensity) => {
  const soundMessageElement = document.querySelector(".scream-room__sound-text p");
  const newIntensityIndex = soundIntensityLevels.findIndex(level => intensity <= level.level);
  if (newIntensityIndex !== -1 && newIntensityIndex !== currentIntensityIndex) {
      currentIntensityIndex = newIntensityIndex;
      soundMessageElement.textContent = soundIntensityLevels[newIntensityIndex].message;
  }
  if (intensity >= 80 && !hasLoudEnoughScreamed) {
      hasLoudEnoughScreamed = true;
      displayPopup();
  }
};

const displayPopup = () => {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
    <h3>You screamed louder than 30% of other visitors!</h3>
    <p>Share your result with others!</p>
    <button class="close-popup">X</button>
  `;
  document.body.appendChild(popup);
  popup.querySelector(".close-popup").addEventListener("click", () => {
      popup.remove();
      resetGame();
  });
};

const startSoundDetection = () => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      audioContext.createMediaStreamSource(stream).connect(analyser);
      analyser.fftSize = 256;
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      detectingSound = true;
      
      const detectSoundIntensity = () => {
          if (!detectingSound) return;
          analyser.getByteFrequencyData(frequencyData);
          let avgVolume = frequencyData.reduce((sum, value) => sum + value) / frequencyData.length;
          updateSoundMessage(avgVolume);
          requestAnimationFrame(detectSoundIntensity);
      };
      detectSoundIntensity();
  }).catch(error => {
      console.error("Microphone access denied:", error);
  });
};
  
const resetGame = () => {
  hasLoudEnoughScreamed = false;
  currentIntensityIndex = 0;
  detectingSound = false;
};

document.getElementById("start-button").addEventListener("click", function() {
  startSoundDetection();
  this.style.display = "none";
});
  
const handleWorkshopButtons = () => {
  document.addEventListener("DOMContentLoaded", function () {
      const buttons = document.querySelectorAll(".workshop__btn");
      const correctSound = new Audio("src/assets/audio/correct.mp3");
      const errorSound = new Audio("src/assets/audio/error.mp3");
      
      buttons.forEach((button) => {
          button.addEventListener("click", function () {
              buttons.forEach((btn) => btn.classList.remove("correct", "incorrect"));
              
              if (button.textContent.trim() === "5£") {
                  button.classList.add("correct");
                  correctSound.currentTime = 0; 
                  correctSound.play();
              } else {
                  button.classList.add("incorrect");
                  errorSound.currentTime = 0; 
                  errorSound.play();
              }
          });
      });
  });
};

const highlightSentences = () => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".bible__launch",
      start: "top",
      end: "bottom 10%",
      scrub: 1,
      pin: true,
    },
  });

  const sentences = document.querySelectorAll('.bible__text span');
  gsap.set(sentences, { opacity: 0.3 });

  sentences.forEach((sentence, index) => {
    tl.to(sentences, { opacity: 0.3, duration: 0.5 }, index * 0.8); 
    tl.to(sentence, { opacity: 1, duration: 0.8 }, index * 0.8);
  });
};

const inkFactoryScroll = () => {
  gsap.to('.ink__moving-image', {
    x: window.innerWidth + 200, 
    duration: 3,
    scrollTrigger: {
      trigger: ".ink__factory",
      start: "top 80%",
      end: "bottom 20%",
      scrub: true,
    },
  });
};

const marriageScroll = () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.marriage',
      start: 'top center',
      end: 'bottom',
      scrub: true,
    }
  });

  tl.to('.moretus', {
    x: 200,
    ease: 'none',
  });

  tl.to('.martina', {
    x: -200, 
    ease: 'none',
  }, 0); 
};

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults;

  toggleFigureImage();
  toggleMenu();
  validateWord();
  handleAudioToggle();
  handleDragDrop();
  handleWorkshopButtons();
  highlightSentences();
  inkFactoryScroll();
  marriageScroll();
};

init();