/* ========================================================
   UNSPOKEN: Procedural Web Audio Engine
   Zero external dependencies. High-fidelity emotional soundtrack.
   ======================================================== */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.reverbNode = null;
    this.initialized = false;

    // Environmental sound states
    this.rainNode = null;
    this.rainGain = null;
    this.heartbeatInterval = null;
    this.currentHeartbeatBpm = 70;
    this.isHeartbeating = false;

    // Music scheduler
    this.musicTimer = null;
    this.currentAct = 0;
    this.stepCounter = 0;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      // Create algorithmic stereo reverb buffer
      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = this.buildReverbImpulse(2.8, 2.0);

      const dryGain = this.ctx.createGain();
      dryGain.gain.value = 0.8;
      const wetGain = this.ctx.createGain();
      wetGain.gain.value = 0.45;

      this.masterGain.connect(dryGain);
      this.masterGain.connect(this.reverbNode);
      this.reverbNode.connect(wetGain);

      dryGain.connect(this.ctx.destination);
      wetGain.connect(this.ctx.destination);

      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio not supported or blocked", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  buildReverbImpulse(duration, decay) {
    const rate = this.ctx.sampleRate;
    const length = rate * duration;
    const impulse = this.ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const t = i / length;
      const n = (1 - t) * Math.pow(Math.random() * 2 - 1, decay);
      left[i] = n;
      right[i] = (1 - t) * Math.pow(Math.random() * 2 - 1, decay);
    }
    return impulse;
  }

  // --- PROCEDURAL ACOUSTIC PIANO NOTE ---
  playPianoNote(freq, duration = 2.0, velocity = 0.6) {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Multi-harmonic synthesized acoustic piano voice
    const harmonics = [1, 2, 3, 4, 5, 6];
    const harmonicGains = [1.0, 0.55, 0.35, 0.2, 0.1, 0.05];

    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.4, now + 0.012); // Crisp hammer strike
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.15, now + 0.18);
    noteGain.gain.exponentialRampToValueAtTime(0.00001, now + duration);

    // Warm low-pass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 5.5, 4800), now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 300), now + duration);

    harmonics.forEach((h, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq * h + (Math.random() - 0.5) * 1.2, now); // slight chorus detune

      const hGain = this.ctx.createGain();
      hGain.gain.value = harmonicGains[idx];

      osc.connect(hGain);
      hGain.connect(filter);
      osc.start(now);
      osc.stop(now + duration);
    });

    filter.connect(noteGain);
    noteGain.connect(this.masterGain);
  }

  // --- CHORD HELPER ---
  playPianoChord(notes, duration = 3.5, velocity = 0.5) {
    notes.forEach((freq, i) => {
      // Arpeggiate slightly for natural human touch
      setTimeout(() => {
        this.playPianoNote(freq, duration, velocity);
      }, i * 40);
    });
  }

  // --- SVEC SCHOOL BELL ---
  playSchoolBell() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const baseFreqs = [587.33, 880, 1174.66, 1760]; // D5 chime harmonics

    baseFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2 / (idx + 1), now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 2.5);
    });
  }

  // --- PROCEDURAL RAIN AUDIO ---
  startRain(intensity = 0.4) {
    if (!this.initialized) return;
    if (this.rainNode) return; // already active

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Pink-noise filter curve for natural rain
    const biquad = this.ctx.createBiquadFilter();
    biquad.type = 'bandpass';
    biquad.frequency.value = 1200;
    biquad.Q.value = 0.6;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.rainGain.gain.linearRampToValueAtTime(intensity, this.ctx.currentTime + 2.0);

    whiteNoise.connect(biquad);
    biquad.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.rainNode = whiteNoise;
  }

  stopRain() {
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
      setTimeout(() => {
        if (this.rainNode) {
          try { this.rainNode.stop(); } catch(e){}
          this.rainNode.disconnect();
          this.rainNode = null;
        }
      }, 1600);
    }
  }

  setRainIntensity(intensity) {
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.linearRampToValueAtTime(intensity, this.ctx.currentTime + 1.0);
    }
  }

  // --- PROCEDURAL THUNDER RUMBLE ---
  playThunder() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    
    // Sub-bass crack
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 1.8);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + 2.0);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.5);
  }

  // --- PROCEDURAL HEARTBEAT ---
  startHeartbeat(bpm = 65, intensity = 0.5) {
    this.stopHeartbeat();
    this.isHeartbeating = true;
    this.currentHeartbeatBpm = bpm;

    const intervalMs = (60 / bpm) * 1000;
    this.heartbeatInterval = setInterval(() => {
      this.triggerSingleHeartbeat(intensity);
    }, intervalMs);
    this.triggerSingleHeartbeat(intensity);
  }

  triggerSingleHeartbeat(intensity = 0.5) {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Double thump (lub-dub)
    [0, 0.16].forEach((offset, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 65 : 55, now + offset);
      osc.frequency.exponentialRampToValueAtTime(30, now + offset + 0.12);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(intensity * (idx === 0 ? 0.7 : 0.5), now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + offset);
      osc.stop(now + offset + 0.15);
    });
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.isHeartbeating = false;
  }

  // --- PHONE NOTIFICATION CHIME ---
  playNotificationPing() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const freqs = [783.99, 1046.5]; // G5 to C6

    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.12);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.001, now + i * 0.12);
      g.gain.linearRampToValueAtTime(0.35, now + i * 0.12 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.6);

      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.6);
    });
  }

  // --- SOFT FOOTSTEP ---
  playFootstep() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // --- HEARTBREAK SHATTER / FLATLINE ---
  playHeartbreakShatter() {
    if (!this.initialized || this.isMuted) return;
    this.stopHeartbeat();
    const now = this.ctx.currentTime;

    // Harsh eerie high sine flatline that slowly fades away
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5 tinnitus

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.2, now + 1.5);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 4.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 4.5);

    // Deep heavy low-end impact
    this.playThunder();
  }

  // --- CHAPTER EMOTIONAL MUSIC DIRECTOR ---
  startMusicForAct(actIndex) {
    if (this.musicTimer) clearInterval(this.musicTimer);
    this.currentAct = actIndex;
    this.stepCounter = 0;

    // Musical progressions per life chapter (Note frequencies in Hz)
    const notes = {
      C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
    };

    let progression = [];
    let intervalTime = 3200;

    switch (actIndex) {
      case 0: // Act 1: The Introvert of SVEC - Warm nostalgia, shy wonder
        progression = [
          { chord: [notes.C3, notes.G3, notes.E4], lead: notes.G4 },
          { chord: [notes.A3, notes.E4, notes.C4], lead: notes.E5 },
          { chord: [notes.F3, notes.C4, notes.A4], lead: notes.D5 },
          { chord: [notes.G3, notes.D4, notes.B4], lead: notes.C5 }
        ];
        this.stopRain();
        this.startHeartbeat(72, 0.3);
        break;

      case 1: // Act 2: Evening Tuition - Rainy dusk, cozy, tender blossoming love
        progression = [
          { chord: [notes.G3, notes.D4, notes.B4], lead: notes.D5 },
          { chord: [notes.E3, notes.B3, notes.G4], lead: notes.B4 },
          { chord: [notes.C3, notes.G3, notes.E4], lead: notes.G4 },
          { chord: [notes.D3, notes.A3, notes.F4], lead: notes.A4 }
        ];
        this.startRain(0.25);
        this.startHeartbeat(80, 0.45);
        break;

      case 2: // Act 3: Separation (9th & 10th Grade) - Cold autumn, distance
        progression = [
          { chord: [notes.D3, notes.A3, notes.F4], lead: notes.A4 },
          { chord: [notes.A3, notes.E4, notes.C4], lead: notes.F4 },
          { chord: [notes.F3, notes.C4, notes.A4], lead: notes.E4 },
          { chord: [notes.C3, notes.G3, notes.E4], lead: notes.D4 }
        ];
        this.stopRain();
        this.stopHeartbeat();
        break;

      case 3: // Act 4: The 3 Years of Void - Midnight solitude, clock tick
        progression = [
          { chord: [notes.A3, notes.E4], lead: notes.C5 },
          { chord: [notes.F3, notes.C4], lead: notes.A4 },
          { chord: [notes.D3, notes.A3], lead: notes.F4 },
          { chord: [notes.E3, notes.B3], lead: notes.G4 }
        ];
        intervalTime = 4200;
        this.stopRain();
        this.stopHeartbeat();
        break;

      case 4: // Act 5: 4 Golden Years - High romance, crazy moments, dreams of marriage
        progression = [
          { chord: [notes.F3, notes.C4, notes.A4, notes.C5], lead: notes.F5 },
          { chord: [notes.C3, notes.G3, notes.E4, notes.G4], lead: notes.E5 },
          { chord: [notes.A3, notes.E4, notes.C5], lead: notes.D5 },
          { chord: [notes.G3, notes.D4, notes.B4], lead: notes.C5 }
        ];
        intervalTime = 2800;
        this.stopRain();
        this.startHeartbeat(86, 0.4);
        break;

      case 5: // Act 6: Middle Class Reality - Diverging paths, luxury showroom tension
        progression = [
          { chord: [notes.D3, notes.A3, notes.F4], lead: notes.D5 },
          { chord: [notes.B3, notes.F4, notes.D4], lead: notes.B4 },
          { chord: [notes.G3, notes.D4, notes.B4], lead: notes.A4 },
          { chord: [notes.A3, notes.E4, notes.C4], lead: notes.F4 }
        ];
        this.startRain(0.35);
        this.startHeartbeat(105, 0.6); // anxious fast heartbeat
        break;

      case 6: // Act 7: The Severance (Love Died) - Storm, heartbreak, flatline
        progression = [
          { chord: [notes.D3, notes.A3], lead: notes.A4 },
          { chord: [notes.D3, notes.F4], lead: notes.F4 },
          { chord: [notes.A3, notes.C4], lead: notes.D4 }
        ];
        intervalTime = 5000;
        this.startRain(0.75);
        break;

      case 7: // Act 8: Ashes of Ambition - Deep melancholy, grand epilogue piano
      default:
        progression = [
          { chord: [notes.C3, notes.G3, notes.E4], lead: notes.G5 },
          { chord: [notes.A3, notes.E4, notes.C5], lead: notes.E5 },
          { chord: [notes.F3, notes.C4, notes.A4], lead: notes.C5 },
          { chord: [notes.G3, notes.D4, notes.B4], lead: notes.D5 },
          { chord: [notes.A3, notes.C4, notes.E4], lead: notes.A4 },
          { chord: [notes.F3, notes.A3, notes.D4], lead: notes.F4 }
        ];
        intervalTime = 3400;
        this.startRain(0.45);
        this.stopHeartbeat();
        break;
    }

    const playStep = () => {
      if (progression.length === 0) return;
      const step = progression[this.stepCounter % progression.length];
      this.playPianoChord(step.chord, 3.8, 0.48);
      setTimeout(() => {
        if (step.lead) this.playPianoNote(step.lead, 2.5, 0.55);
      }, 350);
      this.stepCounter++;
    };

    playStep();
    this.musicTimer = setInterval(playStep, intervalTime);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const soundEngine = new SoundEngine();
