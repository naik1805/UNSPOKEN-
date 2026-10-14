/* ========================================================
   UNSPOKEN: Core 3D Game Engine & Cinematic Director
   Bright lighting, intuitive 3rd-person controls, mobile joystick support.
   ======================================================== */

import * as THREE from 'three';
import { CharacterController } from './character.js';
import { SceneBuilder } from './scenes.js';
import { soundEngine } from './audio.js';
import { CHAPTERS } from './story.js';

export class GameEngine {
  constructor(canvasContainer, uiBridge) {
    this.container = canvasContainer;
    this.ui = uiBridge;

    // Core Three.js components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Lighting rig
    this.dirLight = null;
    this.hemiLight = null;
    this.playerLight = null;

    // Subsystems
    this.sceneBuilder = null;
    this.player = null;
    this.npcGirl = null;

    // Game state
    this.currentChapterIndex = 0;
    this.isDialogueActive = false;
    this.isCinematic = false;
    this.cameraMode = 'third_person'; // 'third_person' or 'cinematic'
    this.canInteract = false;
    this.isDesaturated = false;

    // Input state
    this.keys = {};
    this.touchVector = new THREE.Vector2(0, 0);
    this.cameraAngle = { h: 0, v: 0.25 }; // Default behind player looking forward
    this.isDraggingMouse = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.moveSpeed = 6.0;

    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 200);

    // 3. High-Quality WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25; // Bright, rich exposure
    this.container.appendChild(this.renderer.domElement);

    // 4. Bright Lighting Rig
    // Hemisphere light provides soft, even ambient light everywhere so no surface is pitch black
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x94a3b8, 1.4);
    this.scene.add(this.hemiLight);

    // Directional Sun Light
    this.dirLight = new THREE.DirectionalLight(0xfffaea, 2.2);
    this.dirLight.position.set(15, 25, 20);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 70;
    this.dirLight.shadow.camera.left = -25;
    this.dirLight.shadow.camera.right = 25;
    this.dirLight.shadow.camera.top = 25;
    this.dirLight.shadow.camera.bottom = -25;
    this.dirLight.shadow.bias = -0.0003;
    this.scene.add(this.dirLight);

    // Player Rim/Fill Light (Keeps characters clearly visible in all scenes)
    this.playerLight = new THREE.PointLight(0xffffff, 1.2, 10);
    this.scene.add(this.playerLight);

    // 5. Environment Manager
    this.sceneBuilder = new SceneBuilder(this.scene);

    // 6. Bind Listeners
    this.bindEvents();

    // 7. Start Render Loop
    this.animate();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return; // Prevent key repeat from skipping dialogues
      this.keys[e.code] = true;
      if (e.code === 'KeyE') {
        this.triggerInteraction();
      }
      if (e.code === 'Space') {
        this.ui.advanceSubtitle();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mouse drag to orbit camera
    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('#hud-right') || e.target.closest('#game-hud') || e.target.closest('.modal') || e.target.closest('#touch-controls')) return;
      this.isDraggingMouse = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDraggingMouse) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.cameraAngle.h += deltaX * 0.006;
      this.cameraAngle.v = Math.max(0.05, Math.min(1.2, this.cameraAngle.v + deltaY * 0.005));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDraggingMouse = false;
    });

    // Touch swiping to rotate camera on the right half of the screen (multi-touch safe)
    let touchStartX = 0;
    let touchStartY = 0;
    let cameraTouchId = null;

    window.addEventListener('touchstart', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        // Only track touch if it's on the right half of screen and not on buttons or joystick
        if (cameraTouchId === null && t.clientX > window.innerWidth * 0.45 &&
            !t.target.closest('.touch-btn') && !t.target.closest('.hud-btn') &&
            !t.target.closest('#joystick-zone') && !t.target.closest('#joystick-touch-pad') && !t.target.closest('.modal')) {
          cameraTouchId = t.identifier;
          touchStartX = t.clientX;
          touchStartY = t.clientY;
          break;
        }
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (cameraTouchId === null) return;
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        if (t.identifier === cameraTouchId) {
          const deltaX = t.clientX - touchStartX;
          const deltaY = t.clientY - touchStartY;

          this.cameraAngle.h += deltaX * 0.006;
          this.cameraAngle.v = Math.max(0.05, Math.min(1.2, this.cameraAngle.v + deltaY * 0.005));

          touchStartX = t.clientX;
          touchStartY = t.clientY;
          break;
        }
      }
    }, { passive: true });

    const endCameraTouch = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === cameraTouchId) {
          cameraTouchId = null;
          break;
        }
      }
    };
    window.addEventListener('touchend', endCameraTouch, { passive: true });
    window.addEventListener('touchcancel', endCameraTouch, { passive: true });
  }

  onResize() {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // --- CHAPTER LOADING & ATMOSPHERE ---
  loadChapter(chapterIndex) {
    this.currentChapterIndex = chapterIndex;
    const chap = CHAPTERS[chapterIndex];
    if (!chap) return;

    // Reset interaction & state
    this.canInteract = false;
    this.isDialogueActive = false;
    this.touchVector.set(0, 0);
    this.ui.setInteractionActive(false);
    this.isDesaturated = false;
    document.getElementById('heartbeat-vignette').className = 'vignette';

    // Reset camera angle to naturally view objective
    this.cameraAngle = { h: 0, v: 0.25 };

    // 1. Build Environment & Set Bright Atmospheric Lighting
    switch (chap.environment) {
      case 'svec_school':
        this.sceneBuilder.buildSVECSchool();
        // Bright, crisp morning sunshine
        this.setLighting(0xfffaea, 2.4, 0xffffff, 0x86efac, 1.4, 0xb0e0e6, 30, 100, 0x87ceeb);
        break;

      case 'tuition_house':
        this.sceneBuilder.buildTuitionHouse();
        // Warm sunset amber veranda
        this.setLighting(0xfbbf24, 2.0, 0xfde68a, 0x78350f, 1.3, 0x9a3412, 25, 85, 0x78350f);
        break;

      case 'svec_divided_hallway':
        this.sceneBuilder.buildDividedCorridor();
        // Bright, clean school indoor lighting
        this.setLighting(0xffffff, 2.2, 0xf8fafc, 0xcbd5e1, 1.5, 0xcbd5e1, 35, 95, 0xe2e8f0);
        break;

      case 'midnight_room':
        this.sceneBuilder.buildMidnightRoom();
        // Clear moonlight & study desk glow
        this.setLighting(0x38bdf8, 1.5, 0x94a3b8, 0x1e293b, 1.1, 0x0f172a, 20, 75, 0x0f172a);
        break;

      case 'city_overlook':
        this.sceneBuilder.buildCityOverlook();
        // Romantic twilight city lights & starry sky
        this.setLighting(0xa78bfa, 1.8, 0x38bdf8, 0x1e1b4b, 1.2, 0x1e1b4b, 30, 95, 0x18182b);
        break;

      case 'luxury_avenue':
        this.sceneBuilder.buildLuxuryAvenue();
        // Bright downtown avenue lights & showroom
        this.setLighting(0xf1f5f9, 2.0, 0x94a3b8, 0x334155, 1.2, 0x334155, 30, 90, 0x1e293b);
        break;

      case 'rainy_crossroads':
        this.sceneBuilder.buildRainyCrossroads();
        // Spotlight cone from streetlamp on rain
        this.setLighting(0xfef08a, 2.2, 0x64748b, 0x1e293b, 0.9, 0x1e293b, 25, 80, 0x0f172a);
        break;

      case 'midnight_rooftop':
      default:
        this.sceneBuilder.buildMidnightRooftop();
        // High-rise skyscraper skyline & radiant memory crystals
        this.setLighting(0x38bdf8, 1.8, 0x94a3b8, 0x0f172a, 1.1, 0x1e293b, 30, 90, 0x090d16);
        break;
    }

    // 2. Setup Player Character
    let playerOutfit = 'school_boy';
    if (chap.playerAge === 'young_teen') playerOutfit = 'tuition_teen';
    else if (chap.playerAge === 'teen') playerOutfit = 'tuition_teen';
    else if (chap.playerAge === 'adult') playerOutfit = 'adult_casual';
    else if (chap.playerAge === 'heartbroken' || chap.playerAge === 'epilogue') playerOutfit = 'heartbroken';

    if (this.player) {
      this.player.updateOutfit(playerOutfit);
    } else {
      this.player = new CharacterController(this.scene, true, playerOutfit);
    }
    this.player.setPosition(0, 0, 4); // Start at courtyard entrance

    // 3. Setup NPC (The Girl)
    if (this.npcGirl) {
      this.npcGirl.destroy();
      this.npcGirl = null;
    }

    let girlOutfit = 'school_girl';
    if (chap.id === 'act-5' || chap.id === 'act-6') girlOutfit = 'girl_adult';
    else if (chap.id === 'act-7') girlOutfit = 'girl_umbrella';

    if (chap.id !== 'act-4' && chap.id !== 'act-8') {
      this.npcGirl = new CharacterController(this.scene, false, girlOutfit);
      this.npcGirl.setPosition(chap.targetLocation.x, 0, chap.targetLocation.z);
      this.npcGirl.lookAt(new THREE.Vector3(0, 0, 4));
    }

    // 4. Update Audio
    soundEngine.startMusicForAct(chapterIndex);

    // 5. Update HUD & UI
    this.ui.updateHUD(chap);

    if (chapterIndex === 0) {
      // Act screen only in the starting
      this.ui.showTitleCard(chap);
      setTimeout(() => soundEngine.playSchoolBell(), 1200);
    } else {
      // Subsequent acts transition seamlessly with a sleek non-blocking banner
      this.ui.notifyChapterChange(chap);
    }
  }

  setLighting(dirColor, dirIntensity, skyColor, groundColor, hemiIntensity, fogColor, fogNear, fogFar, clearColor) {
    this.dirLight.color.setHex(dirColor);
    this.dirLight.intensity = dirIntensity;

    this.hemiLight.color.setHex(skyColor);
    this.hemiLight.groundColor.setHex(groundColor);
    this.hemiLight.intensity = hemiIntensity;

    this.scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
    this.renderer.setClearColor(clearColor);
  }

  // --- INTERACTION & STORY TRIGGERS ---
  triggerInteraction() {
    if (!this.canInteract || this.isDialogueActive) return;

    const chap = CHAPTERS[this.currentChapterIndex];
    if (!chap) return;

    this.isDialogueActive = true;
    this.ui.setInteractionActive(false);

    // Act 4: Special Smartphone DM experience
    if (chap.isPhoneChapter) {
      this.ui.openPhoneModal();
      return;
    }

    // Act 7: The Heartbreaking Severance
    if (chap.isBreakupChapter) {
      this.startBreakupSequence(chap);
      return;
    }

    // Act 8: Epilogue Memory Vault
    if (chap.isEpilogueChapter) {
      this.ui.startDialogueFlow(chap.dialogues, () => {
        this.ui.showCreditsScreen();
      });
      return;
    }

    // Standard Dialogue Flow
    this.ui.startDialogueFlow(chap.dialogues, () => {
      this.advanceToNextChapter();
    });
  }

  startBreakupSequence(chap) {
    this.ui.startDialogueFlow(chap.dialogues, () => {
      soundEngine.playHeartbreakShatter();

      // Visual Desaturation
      document.getElementById('heartbeat-vignette').classList.add('desaturated');
      this.dirLight.color.setHex(0x64748b);
      this.hemiLight.color.setHex(0x475569);
      this.renderer.setClearColor(0x0f172a);

      // Girl walks away into rain
      if (this.npcGirl) {
        this.npcGirl.lookAt(new THREE.Vector3(0, 0, -35));
        let walkAwayTime = 0;
        const walkInterval = setInterval(() => {
          walkAwayTime += 0.05;
          this.npcGirl.update(0.05, new THREE.Vector2(0, -1));
          if (walkAwayTime > 4.5) {
            clearInterval(walkInterval);
            this.advanceToNextChapter();
          }
        }, 50);
      } else {
        setTimeout(() => this.advanceToNextChapter(), 3000);
      }
    });
  }

  advanceToNextChapter() {
    this.isDialogueActive = false;
    if (this.currentChapterIndex < CHAPTERS.length - 1) {
      this.loadChapter(this.currentChapterIndex + 1);
    } else {
      this.ui.showCreditsScreen();
    }
  }

  toggleCameraMode() {
    this.cameraMode = this.cameraMode === 'third_person' ? 'cinematic' : 'third_person';
    return this.cameraMode;
  }

  resetCamera() {
    this.cameraAngle = { h: 0, v: 0.25 };
  }

  // --- 60 FPS GAME LOOP ---
  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = Math.min(this.clock.getDelta(), 0.1);

    // Update 3D Environments & Weather
    this.sceneBuilder.update(delta);

    // --- ACCURATE THIRD-PERSON MOVEMENT CALCULATION ---
    let inputVector = new THREE.Vector2(0, 0);

    if (!this.isDialogueActive && this.player) {
      if (this.keys['KeyW'] || this.keys['ArrowUp']) inputVector.y -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) inputVector.y += 1;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) inputVector.x -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) inputVector.x += 1;

      // Virtual Joystick touch input
      if (this.touchVector.length() > 0.05) {
        inputVector.x = this.touchVector.x;
        inputVector.y = this.touchVector.y;
      }

      if (inputVector.length() > 0.05) {
        inputVector.normalize();

        // Calculate movement relative to camera horizontal yaw
        const camYaw = this.cameraAngle.h;
        // Forward vector in world coordinates (into screen / away from camera)
        const forwardX = -Math.sin(camYaw);
        const forwardZ = -Math.cos(camYaw);
        // Right vector in world coordinates
        const rightX = Math.cos(camYaw);
        const rightZ = -Math.sin(camYaw);

        const fwdAmount = -inputVector.y; // W / Up is forward (+1)
        const strafeAmount = inputVector.x; // D / Right is +1, A / Left is -1

        const worldMoveX = strafeAmount * rightX + fwdAmount * forwardX;
        const worldMoveZ = strafeAmount * rightZ + fwdAmount * forwardZ;

        // Apply movement to player
        this.player.update(delta, new THREE.Vector2(worldMoveX, worldMoveZ));

        // Footstep audio trigger
        if (Math.random() < 0.04) soundEngine.playFootstep();
      } else {
        this.player.update(delta, null);
      }

      // Keep character fill light positioned directly above player
      if (this.playerLight && this.player) {
        this.playerLight.position.set(
          this.player.position.x,
          this.player.position.y + 2.5,
          this.player.position.z
        );
      }

      // Proximity Check to Objective / Girl
      const chap = CHAPTERS[this.currentChapterIndex];
      if (chap && !this.isDialogueActive) {
        const dist = this.player.position.distanceTo(
          new THREE.Vector3(chap.targetLocation.x, 0, chap.targetLocation.z)
        );

        if (dist < 3.5) {
          if (!this.canInteract) {
            this.canInteract = true;
            this.ui.setInteractionActive(true, chap.interactPrompt);
          }
        } else {
          if (this.canInteract) {
            this.canInteract = false;
            this.ui.setInteractionActive(false);
          }
        }
      }
    }

    if (this.npcGirl && !this.isBreakupWalking) {
      this.npcGirl.update(delta, null);
    }

    // --- ACCURATE THIRD-PERSON CAMERA RIG ---
    if (this.player) {
      if (this.cameraMode === 'third_person') {
        const camDistance = 5.8;
        const camHeight = 2.2;

        // Position camera behind player in +Z when cameraAngle.h = 0
        const targetCamX = this.player.position.x + Math.sin(this.cameraAngle.h) * camDistance * Math.cos(this.cameraAngle.v);
        const targetCamZ = this.player.position.z + Math.cos(this.cameraAngle.h) * camDistance * Math.cos(this.cameraAngle.v);
        const targetCamY = this.player.position.y + camHeight + Math.sin(this.cameraAngle.v) * camDistance * 0.7;

        this.camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), delta * 9.0);
        this.camera.lookAt(
          this.player.position.x,
          this.player.position.y + 1.2,
          this.player.position.z
        );
      } else {
        // Dramatic Cinematic Framing
        const chap = CHAPTERS[this.currentChapterIndex];
        const lookTarget = chap ? new THREE.Vector3(chap.targetLocation.x * 0.5, 1.2, chap.targetLocation.z * 0.5) : this.player.position;
        const targetCamPos = new THREE.Vector3(this.player.position.x + 3.5, 1.2, this.player.position.z + 3.5);

        this.camera.position.lerp(targetCamPos, delta * 3.0);
        this.camera.lookAt(lookTarget);
      }
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}
