/* ========================================================
   UNSPOKEN: Main Application Entry Point & UI Bridge
   Orchestrates GameEngine, Audio, UI Modals, Subtitles & Input
   ======================================================== */

import { GameEngine } from './game.js';
import { soundEngine } from './audio.js';
import { CHAPTERS, MEMORY_VAULT } from './story.js';

class AppUIBridge {
  constructor() {
    this.engine = null;

    // UI Cache
    this.loadingScreen = document.getElementById('loading-screen');
    this.loadingBar = document.getElementById('loading-bar');
    this.loadingText = document.getElementById('loading-text');
    this.btnEnter = document.getElementById('btn-enter');

    this.hudActNum = document.getElementById('hud-act-num');
    this.hudActTitle = document.getElementById('hud-act-title');
    this.hudActYear = document.getElementById('hud-act-year');
    this.objectiveBanner = document.getElementById('objective-banner');
    this.objectiveText = document.getElementById('objective-text');

    this.interactionHud = document.getElementById('interaction-hud');
    this.interactionText = document.getElementById('interaction-text');

    this.subtitlesContainer = document.getElementById('subtitles-container');
    this.subtitleSpeaker = document.getElementById('subtitle-speaker');
    this.subtitleText = document.getElementById('subtitle-text');

    this.choiceModal = document.getElementById('choice-modal');
    this.choicePrompt = document.getElementById('choice-prompt');
    this.choiceOptions = document.getElementById('choice-options');

    this.titleCard = document.getElementById('title-card');
    this.cardActNum = document.getElementById('card-act-num');
    this.cardActTitle = document.getElementById('card-act-title');
    this.cardActQuote = document.getElementById('card-act-quote');

    this.phoneModal = document.getElementById('phone-modal');
    this.phoneChatBody = document.getElementById('phone-chat-body');
    this.phoneInput = document.getElementById('phone-input');
    this.phoneSendBtn = document.getElementById('phone-send-btn');

    this.chapterMenu = document.getElementById('chapter-menu');
    this.chapterGrid = document.getElementById('chapter-grid');

    this.memoryModal = document.getElementById('memory-modal');
    this.memYear = document.getElementById('mem-year');
    this.memTitle = document.getElementById('mem-title');
    this.memDesc = document.getElementById('mem-desc');
    this.memReflection = document.getElementById('mem-reflection');

    this.creditsScreen = document.getElementById('credits-screen');

    this.dialogueTapZone = document.getElementById('dialogue-tap-zone');
    this.chapterToast = document.getElementById('chapter-toast');
    this.toastAct = document.getElementById('toast-act');
    this.toastTitle = document.getElementById('toast-title');
    this.toastTimer = null;

    // Dialogue playback state
    this.dialogueQueue = [];
    this.dialogueIndex = 0;
    this.dialogueCallback = null;
    this.typewriterTimer = null;
    this.lastAdvanceTime = 0;

    this.setupListeners();
    this.simulateAssetLoading();
  }

  setupListeners() {
    // 1. Enter Journey Button
    this.btnEnter.addEventListener('click', () => {
      soundEngine.init();
      soundEngine.resume();
      this.loadingScreen.classList.remove('active');
      document.body.classList.remove('loading');
      document.body.classList.add('cinematic');

      // Initialize Three.js Game Engine
      const container = document.getElementById('canvas-container');
      this.engine = new GameEngine(container, this);
      this.engine.loadChapter(0);
    });

    // 2. HUD Buttons
    document.getElementById('btn-audio').addEventListener('click', () => {
      const isMuted = soundEngine.toggleMute();
      document.getElementById('icon-sound-on').style.display = isMuted ? 'none' : 'block';
      document.getElementById('icon-sound-off').style.display = isMuted ? 'block' : 'none';
    });

    document.getElementById('btn-camera').addEventListener('click', () => {
      if (!this.engine) return;
      const mode = this.engine.toggleCameraMode();
      document.getElementById('cam-mode-text').textContent = mode === 'third_person' ? 'Cinematic' : 'Explore';
    });

    document.getElementById('btn-toggle-joystick').addEventListener('click', () => {
      const tc = document.getElementById('touch-controls');
      tc.classList.toggle('active');
      const isOn = tc.classList.contains('active');
      document.getElementById('joy-toggle-text').textContent = isOn ? 'Joystick: ON' : 'Joystick: OFF';
    });

    document.getElementById('btn-chapters').addEventListener('click', () => {
      this.openChapterMenu();
    });

    document.getElementById('btn-close-chapters').addEventListener('click', () => {
      this.chapterMenu.classList.remove('active');
    });

    // 3. Subtitle advance on click or tap anywhere
    this.subtitlesContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      this.advanceSubtitle();
    });

    if (this.dialogueTapZone) {
      this.dialogueTapZone.addEventListener('click', (e) => {
        e.stopPropagation();
        this.advanceSubtitle();
      });
      this.dialogueTapZone.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        this.advanceSubtitle();
      }, { passive: true });
    }

    // 4. Smartphone Simulator
    this.phoneSendBtn.addEventListener('click', () => {
      this.sendPhoneDM();
    });
    this.phoneInput.addEventListener('click', () => {
      this.phoneInput.value = "Hey... do you still remember SVEC?";
    });

    // 5. Memory Modal Close
    document.getElementById('btn-close-memory').addEventListener('click', () => {
      this.memoryModal.classList.remove('active');
    });

    // 6. Ending Buttons
    document.getElementById('btn-restart').addEventListener('click', () => {
      this.creditsScreen.classList.remove('active');
      if (this.engine) this.engine.loadChapter(0);
    });

    document.getElementById('btn-freeroam').addEventListener('click', () => {
      this.creditsScreen.classList.remove('active');
      if (this.engine) this.engine.loadChapter(7); // Epilogue free-roam
    });

    // 7. Virtual Joystick Touch Handler
    this.setupVirtualJoystick();
  }

  simulateAssetLoading() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        this.loadingBar.style.width = '100%';
        this.loadingText.textContent = 'Memories assembled. Ready to begin.';
        this.btnEnter.style.display = 'inline-flex';
      } else {
        this.loadingBar.style.width = `${progress}%`;
        if (progress > 30) this.loadingText.textContent = 'Synthesizing SVEC School and corridors...';
        if (progress > 60) this.loadingText.textContent = 'Tuning acoustic piano soundscape...';
        if (progress > 85) this.loadingText.textContent = 'Preparing the 10-year emotional timeline...';
      }
    }, 120);
  }

  // --- HUD & PROMPT UPDATES ---
  updateHUD(chapter) {
    this.hudActNum.textContent = chapter.actNum;
    this.hudActTitle.textContent = chapter.title;
    this.hudActYear.textContent = chapter.subtitle;
    this.objectiveText.textContent = chapter.objective;

    // Atmospheric pulse adjustments
    const vignette = document.getElementById('heartbeat-vignette');
    vignette.className = 'vignette';
    if (chapter.id === 'act-1' || chapter.id === 'act-2' || chapter.id === 'act-5') {
      vignette.classList.add('heartbeat-warm');
    } else if (chapter.id === 'act-6') {
      vignette.classList.add('heartbeat-fast');
    } else if (chapter.id === 'act-7' || chapter.id === 'act-8') {
      vignette.classList.add('heartbeat-cold');
    }
  }

  showTitleCard(chapter) {
    this.cardActNum.textContent = chapter.actNum;
    this.cardActTitle.textContent = chapter.title.toUpperCase();
    this.cardActQuote.textContent = `"${chapter.quote}"`;

    this.titleCard.classList.add('active');
    setTimeout(() => {
      this.titleCard.classList.remove('active');
    }, 2800);
  }

  notifyChapterChange(chapter) {
    if (!this.chapterToast) return;
    this.toastAct.textContent = chapter.actNum;
    this.toastTitle.textContent = `${chapter.title} • ${chapter.subtitle}`;
    this.chapterToast.classList.add('active');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.chapterToast.classList.remove('active');
    }, 2800);
  }

  setInteractionActive(isActive, promptText = "Interact") {
    if (isActive) {
      this.interactionText.textContent = promptText;
      this.interactionHud.classList.add('active');
    } else {
      this.interactionHud.classList.remove('active');
    }
  }

  // --- DIALOGUE & SUBTITLE PLAYBACK ---
  startDialogueFlow(dialogues, onComplete) {
    this.dialogueQueue = dialogues;
    this.dialogueIndex = 0;
    this.dialogueCallback = onComplete;
    this.displayNextDialogue();
  }

  displayNextDialogue() {
    if (this.dialogueIndex >= this.dialogueQueue.length) {
      this.subtitlesContainer.classList.remove('active');
      if (this.dialogueTapZone) this.dialogueTapZone.classList.remove('active');
      if (this.dialogueCallback) {
        const cb = this.dialogueCallback;
        this.dialogueCallback = null;
        cb();
      }
      return;
    }

    const item = this.dialogueQueue[this.dialogueIndex];

    if (item.speaker === 'CHOICE') {
      this.subtitlesContainer.classList.remove('active');
      if (this.dialogueTapZone) this.dialogueTapZone.classList.remove('active');
      this.showChoiceModal(item);
      return;
    }

    // Standard Monologue or Dialogue
    this.subtitleSpeaker.textContent = item.speaker;
    this.subtitleSpeaker.className = 'subtitle-speaker';
    if (item.speaker === 'HER') this.subtitleSpeaker.classList.add('girl');
    if (item.speaker === 'TUITION TEACHER') this.subtitleSpeaker.classList.add('girl');

    // Typewriter effect
    this.typewriterAnimate(item.text);
    this.subtitlesContainer.classList.add('active');
    if (this.dialogueTapZone) this.dialogueTapZone.classList.add('active');
  }

  typewriterAnimate(text) {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    this.subtitleText.textContent = '';
    let idx = 0;
    this.typewriterTimer = setInterval(() => {
      if (idx < text.length) {
        this.subtitleText.textContent += text[idx];
        idx++;
      } else {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
      }
    }, 24);
  }

  advanceSubtitle() {
    if (!this.subtitlesContainer.classList.contains('active')) return;
    const now = Date.now();
    // Prevent accidental double clicks or rapid spacebar skipping
    if (this.lastAdvanceTime && (now - this.lastAdvanceTime < 320)) return;

    if (this.typewriterTimer) {
      // Complete line immediately if clicked while still typing
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
      const current = this.dialogueQueue[this.dialogueIndex];
      if (current) this.subtitleText.textContent = current.text;
      this.lastAdvanceTime = now;
      return;
    }

    this.lastAdvanceTime = now;
    this.dialogueIndex++;
    this.displayNextDialogue();
  }

  showChoiceModal(choiceItem) {
    this.choicePrompt.textContent = choiceItem.prompt;
    this.choiceOptions.innerHTML = '';

    choiceItem.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        this.choiceModal.classList.remove('active');
        this.dialogueIndex++;
        this.displayNextDialogue();
      });
      this.choiceOptions.appendChild(btn);
    });

    this.choiceModal.classList.add('active');
  }

  // --- SMARTPHONE SIMULATOR (ACT 4) ---
  openPhoneModal() {
    this.phoneModal.classList.add('active');
    this.phoneInput.value = "Hey... do you still remember SVEC?";
  }

  sendPhoneDM() {
    const text = this.phoneInput.value.trim();
    if (!text) return;

    // Add user bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble sent';
    userBubble.textContent = text;
    this.phoneChatBody.appendChild(userBubble);
    this.phoneInput.value = '';
    this.phoneChatBody.scrollTop = this.phoneChatBody.scrollHeight;

    // Simulate typing indicator & reply
    setTimeout(() => {
      const typingInd = document.createElement('div');
      typingInd.className = 'chat-bubble received';
      typingInd.textContent = "typing...";
      this.phoneChatBody.appendChild(typingInd);
      this.phoneChatBody.scrollTop = this.phoneChatBody.scrollHeight;

      setTimeout(() => {
        this.phoneChatBody.removeChild(typingInd);

        const replyBubble = document.createElement('div');
        replyBubble.className = 'chat-bubble received';
        replyBubble.textContent = "How could I ever forget the quiet boy from tuition? Let's meet.";
        this.phoneChatBody.appendChild(replyBubble);
        this.phoneChatBody.scrollTop = this.phoneChatBody.scrollHeight;

        soundEngine.playNotificationPing();

        // Close phone and advance to Act 5 after connection
        setTimeout(() => {
          this.phoneModal.classList.remove('active');
          if (this.engine) this.engine.advanceToNextChapter();
        }, 2500);
      }, 1800);
    }, 1000);
  }

  // --- CHAPTER MENU ---
  openChapterMenu() {
    this.chapterGrid.innerHTML = '';
    CHAPTERS.forEach((c, idx) => {
      const card = document.createElement('div');
      card.className = `chapter-card ${this.engine && this.engine.currentChapterIndex === idx ? 'current' : ''}`;
      card.innerHTML = `
        <div class="card-num">${c.actNum}</div>
        <div class="card-name">${c.title}</div>
        <div class="card-time">${c.subtitle}</div>
      `;
      card.addEventListener('click', () => {
        this.chapterMenu.classList.remove('active');
        if (this.engine) this.engine.loadChapter(idx);
      });
      this.chapterGrid.appendChild(card);
    });
    this.chapterMenu.classList.add('active');
  }

  // --- MEMORY MODAL ---
  showMemoryItem(memId) {
    const mem = MEMORY_VAULT.find(m => m.id === memId) || MEMORY_VAULT[0];
    this.memYear.textContent = mem.year;
    this.memTitle.textContent = mem.title;
    this.memDesc.textContent = mem.desc;
    this.memReflection.textContent = `"${mem.reflection}"`;
    this.memoryModal.classList.add('active');
  }

  // --- CREDITS SCREEN ---
  showCreditsScreen() {
    this.creditsScreen.classList.add('active');
    soundEngine.stopRain();
    soundEngine.stopHeartbeat();
  }

  // --- VIRTUAL JOYSTICK FOR TOUCH & MOBILE ---
  setupVirtualJoystick() {
    const zone = document.getElementById('joystick-zone');
    const thumb = document.getElementById('joystick-thumb');
    if (!zone || !thumb) return;

    let isTracking = false;
    let joystickTouchId = null;
    let center = { x: 0, y: 0 };
    const maxRadius = 45;

    const startTracking = (clientX, clientY, touchId = null) => {
      isTracking = true;
      joystickTouchId = touchId;
      const rect = zone.getBoundingClientRect();
      center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      updateThumb(clientX, clientY);
    };

    const updateThumb = (clientX, clientY) => {
      if (!isTracking || !this.engine) return;
      const dx = clientX - center.x;
      const dy = clientY - center.y;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      // Clamp visual thumb inside base boundary
      const clampedDist = Math.min(maxRadius, dist);
      const thumbX = Math.cos(angle) * clampedDist;
      const thumbY = Math.sin(angle) * clampedDist;
      thumb.style.transform = `translate(calc(-50% + ${thumbX}px), calc(-50% + ${thumbY}px))`;

      // Movement vector strength is between 0 and 1
      const strength = Math.min(1.0, Math.max(0.1, dist / (maxRadius * 0.6)));
      // In inputVector: X is right (+1), left (-1). Y is up (-1), down (+1)
      this.engine.touchVector.set(Math.cos(angle) * strength, Math.sin(angle) * strength);
    };

    const stopTracking = () => {
      isTracking = false;
      joystickTouchId = null;
      thumb.style.transform = 'translate(-50%, -50%)';
      if (this.engine) this.engine.touchVector.set(0, 0);
    };

    // 1. Direct Touch on Joystick Zone
    zone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const touch = e.changedTouches[0];
      startTracking(touch.clientX, touch.clientY, touch.identifier);
    }, { passive: false });

    // 2. Extended Touch Area: Touching anywhere in bottom-left movement quadrant
    const touchControls = document.getElementById('touch-controls');
    if (touchControls) {
      touchControls.addEventListener('touchstart', (e) => {
        if (isTracking) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          // If in bottom-left area and not on buttons
          if (t.clientX < window.innerWidth * 0.45 && t.clientY > window.innerHeight * 0.35 &&
              !t.target.closest('.touch-btn') && !t.target.closest('.hud-btn')) {
            e.preventDefault();
            startTracking(t.clientX, t.clientY, t.identifier);
            break;
          }
        }
      }, { passive: false });
    }

    // 3. Global Window Touch Move - track only the joystick finger
    window.addEventListener('touchmove', (e) => {
      if (!isTracking) return;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === joystickTouchId) {
          e.preventDefault();
          updateThumb(touch.clientX, touch.clientY);
          break;
        }
      }
    }, { passive: false });

    // 4. Global Window Touch End / Cancel
    const handleTouchEnd = (e) => {
      if (!isTracking) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystickTouchId) {
          stopTracking();
          break;
        }
      }
    };
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // 5. Mouse fallback for testing
    zone.addEventListener('mousedown', (e) => {
      startTracking(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (isTracking && joystickTouchId === null) {
        updateThumb(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      if (isTracking && joystickTouchId === null) {
        stopTracking();
      }
    });

    // 6. Direct Directional Arrow Tap/Hold Fallback
    const arrowMap = [
      { sel: '.joy-up', vec: { x: 0, y: -1 } },
      { sel: '.joy-down', vec: { x: 0, y: 1 } },
      { sel: '.joy-left', vec: { x: -1, y: 0 } },
      { sel: '.joy-right', vec: { x: 1, y: 0 } }
    ];
    arrowMap.forEach(({ sel, vec }) => {
      const el = zone.querySelector(sel);
      if (!el) return;

      const onArrowDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        thumb.style.transform = `translate(calc(-50% + ${vec.x * 25}px), calc(-50% + ${vec.y * 25}px))`;
        if (this.engine) this.engine.touchVector.set(vec.x, vec.y);
      };
      const onArrowUp = (e) => {
        e.preventDefault();
        thumb.style.transform = 'translate(-50%, -50%)';
        if (this.engine) this.engine.touchVector.set(0, 0);
      };

      el.addEventListener('touchstart', onArrowDown, { passive: false });
      el.addEventListener('touchend', onArrowUp, { passive: false });
      el.addEventListener('mousedown', onArrowDown);
      el.addEventListener('mouseup', onArrowUp);
    });

    // Mobile interact button (also acts as continue button during dialogue)
    document.getElementById('touch-interact-btn').addEventListener('click', () => {
      if (this.subtitlesContainer.classList.contains('active')) {
        this.advanceSubtitle();
      } else if (this.engine) {
        this.engine.triggerInteraction();
      }
    });

    // Mobile camera reset button
    const camBtn = document.getElementById('touch-reset-cam-btn');
    if (camBtn) {
      camBtn.addEventListener('click', () => {
        if (this.engine) this.engine.resetCamera();
      });
    }
  }
}

// Start Application on Load with touch device detection
window.addEventListener('DOMContentLoaded', () => {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('is-touch');
  }
  window.appBridge = new AppUIBridge();
});
