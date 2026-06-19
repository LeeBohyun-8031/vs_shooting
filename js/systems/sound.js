const SOUND_ENABLED_KEY = "web_shooting_game_sound_enabled";

let audioContext = null;
let masterGain = null;
let soundEnabled = loadSoundEnabled();
let soundVolume = 0.35;

function loadSoundEnabled() {
  return localStorage.getItem(SOUND_ENABLED_KEY) !== "false";
}

function saveSoundEnabled() {
  localStorage.setItem(SOUND_ENABLED_KEY, String(soundEnabled));
}

function initSound() {
  if (audioContext) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    soundEnabled = false;
    updateSoundToggleButton();
    return;
  }

  audioContext = new AudioContextClass();

  masterGain = audioContext.createGain();
  masterGain.gain.value = soundEnabled ? soundVolume : 0;
  masterGain.connect(audioContext.destination);

  updateSoundToggleButton();
}

function unlockSound() {
  initSound();

  if (!audioContext) return;

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function setSoundEnabled(enabled) {
  soundEnabled = enabled;
  saveSoundEnabled();
  updateSoundToggleButton();

  if (masterGain) {
    masterGain.gain.value = soundEnabled ? soundVolume : 0;
  }
}

function toggleSound() {
  setSoundEnabled(!soundEnabled);

  if (soundEnabled) {
    playSfx("select");
  }
}

function setSoundVolume(volume) {
  soundVolume = clamp(volume, 0, 1);

  if (masterGain) {
    masterGain.gain.value = soundEnabled ? soundVolume : 0;
  }
}

function updateSoundToggleButton() {
  if (!soundToggleButton) return;

  soundToggleButton.textContent = soundEnabled ? "🔊" : "🔇";

  soundToggleButton.setAttribute(
    "aria-label",
    soundEnabled ? "효과음 끄기" : "효과음 켜기"
  );

  soundToggleButton.setAttribute(
    "title",
    soundEnabled ? "효과음 끄기" : "효과음 켜기"
  );

  soundToggleButton.classList.toggle("muted", !soundEnabled);
}

function playSfx(type) {
  if (!soundEnabled) return;

  initSound();

  if (!audioContext || !masterGain) return;

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  if (type === "shoot") {
    playTone({
      waveType: "square",
      startFrequency: 880,
      endFrequency: 520,
      duration: 0.055,
      volume: 0.08,
    });
    return;
  }

  if (type === "enemyHit") {
    playTone({
      waveType: "triangle",
      startFrequency: 420,
      endFrequency: 190,
      duration: 0.08,
      volume: 0.1,
    });
    return;
  }

  if (type === "enemyDestroy") {
    playNoise({
      duration: 0.18,
      volume: 0.18,
      filterFrequency: 900,
    });

    playTone({
      waveType: "sawtooth",
      startFrequency: 180,
      endFrequency: 70,
      duration: 0.18,
      volume: 0.12,
    });
    return;
  }

  if (type === "playerHit") {
    playTone({
      waveType: "sawtooth",
      startFrequency: 160,
      endFrequency: 55,
      duration: 0.24,
      volume: 0.16,
    });

    playNoise({
      duration: 0.16,
      volume: 0.1,
      filterFrequency: 600,
    });
    return;
  }

  if (type === "bomb") {
    playNoise({
      duration: 0.42,
      volume: 0.22,
      filterFrequency: 500,
    });

    playTone({
      waveType: "sine",
      startFrequency: 90,
      endFrequency: 35,
      duration: 0.42,
      volume: 0.2,
    });
    return;
  }

  if (type === "select") {
    playTone({
      waveType: "sine",
      startFrequency: 520,
      endFrequency: 620,
      duration: 0.06,
      volume: 0.08,
    });
    return;
  }

  if (type === "confirm") {
    playTone({
      waveType: "sine",
      startFrequency: 680,
      endFrequency: 980,
      duration: 0.09,
      volume: 0.1,
    });
    return;
  }

  if (type === "gameStart") {
    playTone({
      waveType: "square",
      startFrequency: 392,
      endFrequency: 523,
      duration: 0.12,
      volume: 0.13,
      startDelay: 0,
    });

    playTone({
      waveType: "square",
      startFrequency: 523,
      endFrequency: 659,
      duration: 0.14,
      volume: 0.13,
      startDelay: 0.1,
    });

    playTone({
      waveType: "triangle",
      startFrequency: 659,
      endFrequency: 1046,
      duration: 0.2,
      volume: 0.16,
      startDelay: 0.2,
    });

    playNoise({
      duration: 0.12,
      volume: 0.08,
      filterFrequency: 1400,
    });

    return;
  }
}

function playTone(options) {
  if (!audioContext || !masterGain) return;

  const now = audioContext.currentTime + (options.startDelay || 0);
  const duration = options.duration || 0.1;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = options.waveType || "sine";

  oscillator.frequency.setValueAtTime(options.startFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(options.endFrequency, 1),
    now + duration
  );

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(
    Math.max(options.volume || 0.1, 0.0001),
    now + 0.01
  );
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gainNode);
  gainNode.connect(masterGain);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function playNoise(options) {
  if (!audioContext || !masterGain) return;

  const duration = options.duration || 0.15;
  const now = audioContext.currentTime;
  const bufferSize = Math.floor(audioContext.sampleRate * duration);
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    output[i] = Math.random() * 2 - 1;
  }

  const noise = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gainNode = audioContext.createGain();

  noise.buffer = buffer;

  filter.type = "lowpass";
  filter.frequency.value = options.filterFrequency || 800;

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(
    Math.max(options.volume || 0.1, 0.0001),
    now + 0.01
  );
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(masterGain);

  noise.start(now);
  noise.stop(now + duration);
}