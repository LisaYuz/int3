import '../css/style.css'

const figure = document.querySelector('.figure'); 
let lastTap = 0;

figure.addEventListener('touchend', (event) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 500 && tapLength > 0) { 
        if (figure.src.includes('figure.svg')) {
            figure.src = 'assets/figureplantin.png'; 
        } else {
            figure.src = 'assets/figure.svg'; 
        }
    }
    
    lastTap = currentTime;
});



const menuToggle = document.querySelector('.header__menu-toggle');
const menu = document.querySelector('.header__menu');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
  menuToggle.classList.toggle('active');
});


document.querySelector('.go-btn').addEventListener('click', function() {
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




document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("scream-room__audio");
  const iconContainer = document.querySelector(".scream-room__icon-container");
  
  let isPlaying = false;

  iconContainer.addEventListener("click", function () {
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



const horse = document.getElementById('horse');
const paris = document.getElementById('paris');
const antwerp = document.getElementById('antwerp');
const cities = [paris, antwerp]; 

horse.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text', 'horse');
});

cities.forEach(city => {
  city.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  city.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');

    if (data === 'horse') {
      cities.forEach(c => c.style.display = 'none');

      city.classList.add('expanded');
      city.style.display = 'block'; 
    }
  });
});





const soundIntensityLevels = [
    { level: 30, message: "You are too quiet, your partner doesn't hear you" },
    { level: 60, message: "Try a bit harder!" },
    { level: 100, message: "He heard you, and brought ink!" }
  ];
  
  let currentIntensityIndex = 0;
  let hasLoudEnoughScreamed = false;
  let audioContext;
  let analyser;
  let frequencyData = null;
  let detectingSound = false;
  
  const updateSoundMessage = (intensity) => {
    const soundMessageElement = document.querySelector(".scream-room__sound-text p");
  
    const newIntensityIndex = soundIntensityLevels.findIndex((level) => intensity <= level.level);
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
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        const audioSource = audioContext.createMediaStreamSource(stream);
        audioSource.connect(analyser);
        analyser.fftSize = 256;
  
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        detectingSound = true;
  
        const detectSoundIntensity = () => {
          if (!detectingSound) return;
          analyser.getByteFrequencyData(frequencyData);
          let averageVolume = frequencyData.reduce((sum, value) => sum + value) / frequencyData.length;
          updateSoundMessage(averageVolume);
          requestAnimationFrame(detectSoundIntensity);
        };
  
        detectSoundIntensity();
      })
      .catch((error) => {
        console.error("Microphone access denied:", error);
        document.querySelector(".scream-room__sound-text p").textContent =
          "Microphone access is required to play.";
      });
  };
  
  const resetGame = () => {
    hasLoudEnoughScreamed = false;
    currentIntensityIndex = 0;
    detectingSound = false;
  
    document.getElementById("start-button").style.display = "block";
  };
  
  document.getElementById("start-button").addEventListener("click", function() {
    startSoundDetection();
    this.style.display = "none"; 
  });
  


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





const highlightSentences = () => {
  gsap.registerPlugin(ScrollTrigger);

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
  gsap.registerPlugin(ScrollTrigger);

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

  highlightSentences();
  inkFactoryScroll();
  marriageScroll();
};

init();