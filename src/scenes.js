/* ========================================================
   UNSPOKEN: Enhanced 3D Environment Builder
   Detailed showrooms, realistic rain splashes, fountains, and rich cities.
   ======================================================== */

import * as THREE from 'three';

export class SceneBuilder {
  constructor(scene) {
    this.scene = scene;
    this.activeObjects = [];
    this.particles = null;
    this.particleType = null;
    this.interactiveTargets = [];
    this.rainParticles = null;
    this.rainSplashParticles = null;
    this.floatingCrystals = [];
    this.turntable = null;
    this.haloRing = null;
    this.shootingStars = [];
  }

  clear() {
    this.activeObjects.forEach(obj => {
      this.scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
    this.activeObjects = [];
    this.interactiveTargets = [];
    this.floatingCrystals = [];
    this.turntable = null;
    this.haloRing = null;
    this.shootingStars = [];

    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      this.particles.material.dispose();
      this.particles = null;
    }
    if (this.rainParticles) {
      this.scene.remove(this.rainParticles);
      this.rainParticles.geometry.dispose();
      this.rainParticles.material.dispose();
      this.rainParticles = null;
    }
    if (this.rainSplashParticles) {
      this.scene.remove(this.rainSplashParticles);
      this.rainSplashParticles.geometry.dispose();
      this.rainSplashParticles.material.dispose();
      this.rainSplashParticles = null;
    }
  }

  // --- ACT 1: SVEC (BRIGHT MORNING COURTYARD & FOUNTAIN) ---
  buildSVECSchool() {
    this.clear();

    // 1. School Courtyard Ground (Clean bright limestone paving)
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xdfdfdb,
      roughness: 0.65,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.activeObjects.push(ground);

    // Stone pathway with grass borders
    const pathGeo = new THREE.PlaneGeometry(10, 44);
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.5 });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.01, -4);
    path.receiveShadow = true;
    this.scene.add(path);
    this.activeObjects.push(path);

    // 2. School Main Building Facade (Rich terracotta & white molding)
    const buildingGeo = new THREE.BoxGeometry(46, 16, 10);
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0xc2410c, // Rich red terracotta brick
      roughness: 0.7
    });
    const building = new THREE.Mesh(buildingGeo, buildingMat);
    building.position.set(0, 8, -26);
    building.castShadow = true;
    building.receiveShadow = true;
    this.scene.add(building);
    this.activeObjects.push(building);

    // White Roof Molding
    const roofMolding = new THREE.Mesh(
      new THREE.BoxGeometry(48, 1.2, 11),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    roofMolding.position.set(0, 16.5, -26);
    this.scene.add(roofMolding);
    this.activeObjects.push(roofMolding);

    // School Windows with bright sky reflections
    for (let row = 0; row < 2; row++) {
      for (let col = -7; col <= 7; col += 2) {
        const winGeo = new THREE.PlaneGeometry(1.6, 2.2);
        const winMat = new THREE.MeshStandardMaterial({
          color: 0xbae6fd,
          roughness: 0.1,
          metalness: 0.6,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.2
        });
        const win = new THREE.Mesh(winGeo, winMat);
        win.position.set(col * 2.6, 5 + row * 4.5, -20.9);
        this.scene.add(win);
        this.activeObjects.push(win);
      }
    }

    // 3. Central Courtyard Stone Fountain
    const fountainGroup = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
    const pool = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.8, 0.6, 20), stoneMat);
    pool.position.y = 0.3;
    pool.castShadow = true;
    fountainGroup.add(pool);

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8
    });
    const water = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.4, 20), waterMat);
    water.position.y = 0.45;
    fountainGroup.add(water);

    const centerColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 1.8, 12), stoneMat);
    centerColumn.position.y = 1.0;
    fountainGroup.add(centerColumn);

    const upperTier = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.3, 16), stoneMat);
    upperTier.position.y = 1.6;
    fountainGroup.add(upperTier);

    fountainGroup.position.set(0, 0, -4);
    this.scene.add(fountainGroup);
    this.activeObjects.push(fountainGroup);

    // 4. SVEC Arch Entrance Gate with Golden "SVEC" Sign
    const archGroup = new THREE.Group();
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 8, 12), pillarMat);
    p1.position.set(-8, 4, 12);
    p1.castShadow = true;
    archGroup.add(p1);

    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 8, 12), pillarMat);
    p2.position.set(8, 4, 12);
    p2.castShadow = true;
    archGroup.add(p2);

    const beam = new THREE.Mesh(new THREE.BoxGeometry(18, 1.5, 1.2), pillarMat);
    beam.position.set(0, 8, 12);
    beam.castShadow = true;
    archGroup.add(beam);

    // Golden "SVEC" Nameplate
    const signGeo = new THREE.BoxGeometry(9, 1.2, 0.25);
    const signMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.7,
      metalness: 0.8,
      roughness: 0.2
    });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 8, 12.7);
    archGroup.add(sign);

    this.scene.add(archGroup);
    this.activeObjects.push(archGroup);

    // 5. School Bicycle Rack with Parked Student Bicycles
    const bikeRack = this.createBicycleRack(-8, 4);
    this.activeObjects.push(bikeRack);

    // 6. Courtyard Trees & Flowerbeds
    const tree1 = this.createTree(-12, -14, 1.4);
    const tree2 = this.createTree(12, -10, 1.2);
    const tree3 = this.createTree(-13, 2, 1.1);
    const tree4 = this.createTree(13, 4, 1.1);
    this.activeObjects.push(tree1, tree2, tree3, tree4);

    // Colorful Flowerbeds near the walkway
    [-5, 5].forEach(fx => {
      [-10, 0].forEach(fz => {
        const flowerbed = this.createFlowerbed(fx, fz);
        this.activeObjects.push(flowerbed);
      });
    });

    // 7. School Bench near Fountain (Where She Waits)
    const bench = this.createBench(0, -14);
    this.activeObjects.push(bench);

    // Courtyard Fill Sunlight
    const courtLight = new THREE.PointLight(0xfffbeb, 2.4, 35);
    courtLight.position.set(0, 9, -5);
    this.scene.add(courtLight);
    this.activeObjects.push(courtLight);

    // 8. Falling Golden Leaves Particles
    this.createFallingLeaves();

    // 9. Interactive Halo
    this.createInteractionHalo(0, 0.05, -14, 0xf472b6);
  }

  // --- ACT 2: EVENING TUITION HOUSE (RAINY AMBER VERANDA) ---
  buildTuitionHouse() {
    this.clear();

    // 1. Veranda Floor (Warm terracotta planks)
    const floorGeo = new THREE.PlaneGeometry(42, 42);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
    this.activeObjects.push(floor);

    // 2. House Front Wall (Warm cream/peach)
    const wallGeo = new THREE.BoxGeometry(32, 8, 1);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.8 });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 4, -18);
    backWall.castShadow = true;
    this.scene.add(backWall);
    this.activeObjects.push(backWall);

    // Window with glowing interior light where mother brews tea
    const winGeo = new THREE.BoxGeometry(4.0, 3.0, 0.2);
    const winMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9
    });
    const kitchenWin = new THREE.Mesh(winGeo, winMat);
    kitchenWin.position.set(-6, 4.5, -17.4);
    this.scene.add(kitchenWin);
    this.activeObjects.push(kitchenWin);

    // Mother's warm kitchen light
    const kitchenLight = new THREE.PointLight(0xf59e0b, 3.5, 15);
    kitchenLight.position.set(-6, 5, -16);
    this.scene.add(kitchenLight);
    this.activeObjects.push(kitchenLight);

    // Veranda Sloping Terracotta Roof Eaves
    const roofEaves = new THREE.Mesh(
      new THREE.BoxGeometry(34, 1.0, 6.0),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
    );
    roofEaves.position.set(0, 7.8, -14);
    roofEaves.rotation.x = 0.2;
    this.scene.add(roofEaves);
    this.activeObjects.push(roofEaves);

    // Veranda Pillars
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    [-8, 8].forEach(px => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 7, 8), pillarMat);
      p.position.set(px, 3.5, -6);
      p.castShadow = true;
      this.scene.add(p);
      this.activeObjects.push(p);
    });

    // Potted Veranda Plants
    [-7, 7].forEach(potX => {
      const pot = this.createPottedPlant(potX, -7);
      this.activeObjects.push(pot);
    });

    // 3. Wooden Study Desk
    const deskGroup = new THREE.Group();
    const deskTopMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.4 });
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.18, 2.4), deskTopMat);
    deskTop.position.set(0, 1.4, -12);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Desk Legs
    [-1.8, 1.8].forEach(x => {
      [-0.9, 0.9].forEach(z => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 6), deskTopMat);
        leg.position.set(x, 0.7, -12 + z);
        leg.castShadow = true;
        deskGroup.add(leg);
      });
    });

    // Open Geometry Notebooks & Pencil Pouch
    const bookGeo = new THREE.BoxGeometry(0.9, 0.06, 1.1);
    const book1 = new THREE.Mesh(bookGeo, new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
    book1.position.set(-1.0, 1.5, -12);
    const book2 = new THREE.Mesh(bookGeo, new THREE.MeshStandardMaterial({ color: 0xec4899 }));
    book2.position.set(1.0, 1.5, -12);

    const pouch = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
    pouch.rotation.z = Math.PI / 2;
    pouch.position.set(0, 1.5, -11.5);

    // Two warm tea cups with saucers
    const cup1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.14, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    cup1.position.set(-1.4, 1.55, -11.4);
    const cup2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.14, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    cup2.position.set(1.4, 1.55, -11.4);

    deskGroup.add(book1, book2, pouch, cup1, cup2);

    // Glowing Amber Study Lamp on Desk
    const lampMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8
    });
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 0.6, 8), lampMat);
    lamp.position.set(0, 1.7, -12.6);
    deskGroup.add(lamp);

    // Warm Desk Glow
    const lampLight = new THREE.PointLight(0xfef08a, 4.5, 22, 1.2);
    lampLight.position.set(0, 2.8, -12);
    lampLight.castShadow = true;
    this.scene.add(lampLight);
    this.activeObjects.push(lampLight);

    // Two Chairs
    const chair1 = this.createChair(0, -13.6, 0); // Boy
    const chair2 = this.createChair(0, -10.4, Math.PI); // Her
    deskGroup.add(chair1, chair2);

    this.scene.add(deskGroup);
    this.activeObjects.push(deskGroup);

    // 4. Rainy Evening Ambience & Splash Particles
    this.createRain(700, 0.4);
    this.createRainSplashes();

    // 5. Interactive Halo
    this.createInteractionHalo(0, 0.05, -12, 0xf59e0b);
  }

  // --- ACT 3: DIVIDED CORRIDORS (9TH & 10TH GRADE) ---
  buildDividedCorridor() {
    this.clear();

    const floorGeo = new THREE.PlaneGeometry(22, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.4,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
    this.activeObjects.push(floor);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.8 });
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 9, 60), wallMat);
    leftWall.position.set(-10, 4.5, 0);
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 9, 60), wallMat);
    rightWall.position.set(10, 4.5, 0);
    this.scene.add(leftWall, rightWall);
    this.activeObjects.push(leftWall, rightWall);

    // Classroom Doors: 9-A (Left) and 9-B (Right)
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 });
    const doorA = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, 2.8), doorMat);
    doorA.position.set(-9.4, 2.5, -10);
    const doorB = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, 2.8), doorMat);
    doorB.position.set(9.4, 2.5, -10);
    this.scene.add(doorA, doorB);
    this.activeObjects.push(doorA, doorB);

    // Student Lockers along the walls
    for (let lz = -18; lz <= 6; lz += 4) {
      if (lz !== -10) {
        const locker = this.createLockers(-9.3, lz);
        this.activeObjects.push(locker);
      }
    }

    // Overhead Fluorescent Lights
    for (let z = -20; z <= 10; z += 10) {
      const lightFixture = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.2, 4),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8 })
      );
      lightFixture.position.set(0, 8.8, z);
      this.scene.add(lightFixture);
      this.activeObjects.push(lightFixture);

      const ceilLight = new THREE.PointLight(0xffffff, 2.2, 20);
      ceilLight.position.set(0, 7.5, z);
      this.scene.add(ceilLight);
      this.activeObjects.push(ceilLight);
    }

    // Academic Notice Board in Center
    const boardGroup = new THREE.Group();
    const board = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.2, 0.2), new THREE.MeshStandardMaterial({ color: 0x1e40af }));
    board.position.set(0, 3.5, -15);
    boardGroup.add(board);

    // Notice sheets: "SECTION 9-A" and "SECTION 9-B"
    const paperMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const p1 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.4), paperMat);
    p1.position.set(-1.5, 3.5, -14.88);
    const p2 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.4), paperMat);
    p2.position.set(1.5, 3.5, -14.88);
    boardGroup.add(p1, p2);

    this.scene.add(boardGroup);
    this.activeObjects.push(boardGroup);

    this.createInteractionHalo(0, 0.05, -15, 0x38bdf8);
  }

  // --- ACT 4: MIDNIGHT ROOM (THE 3 YEARS OF VOID) ---
  buildMidnightRoom() {
    this.clear();

    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
    this.activeObjects.push(floor);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(24, 7, 0.5), wallMat);
    backWall.position.set(0, 3.5, -11);
    this.scene.add(backWall);
    this.activeObjects.push(backWall);

    // Study Desk with Laptop & 3D Smartphone
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 1.8), deskMat);
    desk.position.set(0, 1.4, -9.5);
    this.scene.add(desk);
    this.activeObjects.push(desk);

    // Glowing Smartphone model on desk
    const phoneMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.6,
      metalness: 0.9
    });
    const phone = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.7), phoneMat);
    phone.position.set(0, 1.5, -9.5);
    this.scene.add(phone);
    this.activeObjects.push(phone);

    // Pulsing notification light
    const phoneLight = new THREE.PointLight(0x38bdf8, 4.5, 12, 1.5);
    phoneLight.position.set(0, 2.0, -9.5);
    this.scene.add(phoneLight);
    this.activeObjects.push(phoneLight);

    // Desk Lamp
    const deskLamp = new THREE.PointLight(0xfef08a, 2.8, 14);
    deskLamp.position.set(-1.2, 2.4, -9.5);
    this.scene.add(deskLamp);
    this.activeObjects.push(deskLamp);

    // Moonlight
    const moonLight = new THREE.DirectionalLight(0x60a5fa, 1.8);
    moonLight.position.set(-6, 9, -3);
    this.scene.add(moonLight);
    this.activeObjects.push(moonLight);

    this.createInteractionHalo(0, 0.05, -9.5, 0x38bdf8);
  }

  // --- ACT 5: ROMANTIC CITY OVERLOOK (4 GOLDEN YEARS) ---
  buildCityOverlook() {
    this.clear();

    // Cliffside Terrace
    const terraceGeo = new THREE.CylinderGeometry(18, 19, 3, 24);
    const terraceMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
    const terrace = new THREE.Mesh(terraceGeo, terraceMat);
    terrace.position.set(0, -1.5, -8);
    terrace.receiveShadow = true;
    this.scene.add(terrace);
    this.activeObjects.push(terrace);

    // Stone Balustrade
    const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
    const rail = new THREE.Mesh(new THREE.TorusGeometry(17.8, 0.2, 8, 24, Math.PI), railMat);
    rail.rotation.x = Math.PI / 2;
    rail.position.set(0, 0.9, -8);
    this.scene.add(rail);
    this.activeObjects.push(rail);

    // Romantic Park Bench
    const bench = this.createBench(0, -16);
    this.activeObjects.push(bench);

    // Glowing String of Fairy Lights
    for (let i = -8; i <= 8; i += 1.4) {
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.9 })
      );
      bulb.position.set(i, 2.8 + Math.sin(i * 0.5) * 0.4, -16);
      this.scene.add(bulb);
      this.activeObjects.push(bulb);
    }

    const fairyLight = new THREE.PointLight(0xfef08a, 3.5, 22);
    fairyLight.position.set(0, 3.8, -14);
    this.scene.add(fairyLight);
    this.activeObjects.push(fairyLight);

    // Scooter with glowing headlight
    const scooter = this.createScooter(-4, 0);
    this.activeObjects.push(scooter);

    // Street Food / Chai Stall with glowing lantern
    const chaiStall = this.createStreetFoodCart(6, -4);
    this.activeObjects.push(chaiStall);

    // City Skyline & Starry Sky
    this.createCitySkyline();
    this.createStarrySky();

    this.createInteractionHalo(0, 0.05, -16, 0xf472b6);
  }

  // --- ACT 6: ENHANCED MULTI-CAR LUXURY SHOWROOM & AVENUE ---
  buildLuxuryAvenue() {
    this.clear();

    // 1. Wet Glistening Asphalt Street
    const streetGeo = new THREE.PlaneGeometry(50, 70);
    const streetMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.4
    });
    const street = new THREE.Mesh(streetGeo, streetMat);
    street.rotation.x = -Math.PI / 2;
    street.receiveShadow = true;
    this.scene.add(street);
    this.activeObjects.push(street);

    // Sidewalk
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
    const curb = new THREE.Mesh(new THREE.BoxGeometry(16, 0.35, 70), sidewalkMat);
    curb.position.set(-10, 0.17, 0);
    this.scene.add(curb);
    this.activeObjects.push(curb);

    // 2. Grand Glass Automobile Showroom Building
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.05,
      metalness: 0.8,
      transparent: true,
      opacity: 0.55
    });
    const glassFacade = new THREE.Mesh(new THREE.BoxGeometry(0.2, 10, 44), glassMat);
    glassFacade.position.set(-18, 5, -8);
    this.scene.add(glassFacade);
    this.activeObjects.push(glassFacade);

    // Showroom Interior Floor (High-Gloss White Marble)
    const marbleFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 44),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1, metalness: 0.2 })
    );
    marbleFloor.rotation.x = -Math.PI / 2;
    marbleFloor.position.set(-28, 0.05, -8);
    this.scene.add(marbleFloor);
    this.activeObjects.push(marbleFloor);

    // Bright Neon Showroom Brand Sign
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 1.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    signBoard.position.set(-17.8, 9.5, -8);
    this.scene.add(signBoard);
    this.activeObjects.push(signBoard);

    const neonSign = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.8, 14),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.9
      })
    );
    neonSign.position.set(-17.7, 9.5, -8);
    this.scene.add(neonSign);
    this.activeObjects.push(neonSign);

    // 3. VEHICLE 1: Sleek Metallic Silver Sports Coupe on Turntable
    const turntableGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.3, 24);
    const turntableMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
    this.turntable = new THREE.Mesh(turntableGeo, turntableMat);
    this.turntable.position.set(-24, 0.2, -12);
    this.scene.add(this.turntable);
    this.activeObjects.push(this.turntable);

    const sportsCar = this.createLuxuryCar(0, 0);
    this.turntable.add(sportsCar);

    // 4. VEHICLE 2: Bold Obsidian Black Luxury SUV
    const luxurySUV = this.createLuxurySUV(-24, -2);
    this.scene.add(luxurySUV);
    this.activeObjects.push(luxurySUV);

    // Showroom Overhead High-Power Spotlights
    const spot1 = new THREE.SpotLight(0xffffff, 9.0, 30, Math.PI / 3, 0.4);
    spot1.position.set(-24, 10, -12);
    spot1.target.position.set(-24, 0, -12);
    this.scene.add(spot1, spot1.target);
    this.activeObjects.push(spot1, spot1.target);

    const spot2 = new THREE.SpotLight(0x38bdf8, 6.0, 25, Math.PI / 3, 0.4);
    spot2.position.set(-24, 10, -2);
    spot2.target.position.set(-24, 0, -2);
    this.scene.add(spot2, spot2.target);
    this.activeObjects.push(spot2, spot2.target);

    // 5. Outdoor Café Patio (Posh Lounge outside)
    const cafeTable = this.createCafePatio(-6, -16);
    this.activeObjects.push(cafeTable);

    // 6. Street Lighting along the boulevard
    for (let sz = -20; sz <= 10; sz += 15) {
      const streetLamp = this.createStreetLamp(-3, sz);
      this.activeObjects.push(streetLamp);
    }

    // 7. Boy's modest 100cc scooter parked in the drizzle across the road
    const scooter = this.createScooter(4, -8);
    this.activeObjects.push(scooter);

    // Rain drizzle & puddle ripples
    this.createRain(600, 0.35);
    this.createRainSplashes();

    this.createInteractionHalo(0, 0.05, -15, 0xd4af37);
  }

  // --- ACT 7: THE RAINY CROSSROADS (WHERE LOVE DIED) ---
  buildRainyCrossroads() {
    this.clear();

    const roadGeo = new THREE.PlaneGeometry(60, 60);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.15,
      metalness: 0.4
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.receiveShadow = true;
    this.scene.add(road);
    this.activeObjects.push(road);

    // Lone Sodium Streetlamp
    const lampGroup = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 8, 8), poleMat);
    pole.position.set(0, 4, -14);
    pole.castShadow = true;
    lampGroup.add(pole);

    const headMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 1.2), headMat);
    lampHead.position.set(0, 8, -13.5);
    lampGroup.add(lampHead);

    // Spotlight cone on the wet pavement
    const spot = new THREE.SpotLight(0xfef08a, 10.0, 28, Math.PI / 3, 0.4);
    spot.position.set(0, 7.8, -13.5);
    spot.target.position.set(0, 0, -14);
    spot.castShadow = true;
    this.scene.add(spot, spot.target);
    lampGroup.add(spot);

    // Bus stop shelter with flickering neon panel
    const busShelter = this.createBusShelter(6, -14);
    this.activeObjects.push(busShelter);

    this.scene.add(lampGroup);
    this.activeObjects.push(lampGroup);

    // Heavy Torrential Rain & Splashes
    this.createRain(1400, 0.75);
    this.createRainSplashes();

    this.createInteractionHalo(0, 0.05, -14, 0xef4444);
  }

  // --- ACT 8: MIDNIGHT ROOFTOP (THE ASHES OF AMBITION) ---
  buildMidnightRooftop() {
    this.clear();

    const roofGeo = new THREE.BoxGeometry(32, 2, 32);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, -1, -8);
    roof.receiveShadow = true;
    this.scene.add(roof);
    this.activeObjects.push(roof);

    // Helipad "H" Marking on rooftop
    const padRing = new THREE.Mesh(
      new THREE.RingGeometry(5.5, 6.0, 32),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide })
    );
    padRing.rotation.x = -Math.PI / 2;
    padRing.position.set(0, 0.02, -16);
    this.scene.add(padRing);
    this.activeObjects.push(padRing);

    // Safety Railings
    const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
    [-16, 16].forEach(x => {
      const r = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.4, 32), railMat);
      r.position.set(x, 0.7, -8);
      this.scene.add(r);
      this.activeObjects.push(r);
    });
    const backRail = new THREE.Mesh(new THREE.BoxGeometry(32, 1.4, 0.15), railMat);
    backRail.position.set(0, 0.7, -24);
    this.scene.add(backRail);
    this.activeObjects.push(backRail);

    // Radio Antenna Tower with Blinking Beacon
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.4, 12, 6), towerMat);
    tower.position.set(-12, 6, -20);
    this.scene.add(tower);
    this.activeObjects.push(tower);

    const beaconLight = new THREE.PointLight(0xef4444, 4.0, 15);
    beaconLight.position.set(-12, 12.2, -20);
    this.scene.add(beaconLight);
    this.activeObjects.push(beaconLight);

    // 5 Glowing Memory Crystals (High Radiance)
    const crystalGeo = new THREE.OctahedronGeometry(0.55, 0);
    const colors = [0xf59e0b, 0xf472b6, 0x38bdf8, 0x10b981, 0xef4444];

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.95,
        roughness: 0.1
      });
      const crystal = new THREE.Mesh(crystalGeo, mat);
      crystal.position.set(Math.cos(angle) * 4.2, 1.8, -16 + Math.sin(angle) * 4.2);
      crystal.castShadow = true;
      this.scene.add(crystal);
      this.activeObjects.push(crystal);
      this.floatingCrystals.push(crystal);
    }

    // Pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.4, 0.6, 16),
      new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xd97706, emissiveIntensity: 0.5, metalness: 0.7 })
    );
    pedestal.position.set(0, 0.3, -16);
    this.scene.add(pedestal);
    this.activeObjects.push(pedestal);

    // City Skyline & Rain
    this.createCitySkyline();
    this.createRain(900, 0.5);
    this.createRainSplashes();

    this.createInteractionHalo(0, 0.05, -16, 0xd4af37);
  }

  // --- LUXURY VEHICLE GENERATORS ---
  createLuxuryCar(x, z) {
    const car = new THREE.Group();
    const carPaint = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Pearlescent silver sports coupe
      metalness: 0.95,
      roughness: 0.1
    });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.8 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });

    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.7, 4.8), carPaint);
    lowerBody.position.y = 0.6;
    lowerBody.castShadow = true;
    car.add(lowerBody);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.65, 2.5), glassMat);
    cabin.position.set(0, 1.25, -0.2);
    car.add(cabin);

    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-0.85, 0.85].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.08), hlMat);
      hl.position.set(hx, 0.7, 2.42);
      car.add(hl);
    });

    [-1.15, 1.15].forEach(wx => {
      [-1.4, 1.4].forEach(wz => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 14), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.38, wz);
        car.add(wheel);
      });
    });

    car.position.set(x, 0, z);
    return car;
  }

  createLuxurySUV(x, z) {
    const car = new THREE.Group();
    const blackPaint = new THREE.MeshStandardMaterial({
      color: 0x090d16, // Obsidian black SUV
      metalness: 0.9,
      roughness: 0.15
    });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.1, metalness: 0.9 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });

    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.1, 5.2), blackPaint);
    lowerBody.position.y = 1.0;
    lowerBody.castShadow = true;
    car.add(lowerBody);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 3.4), glassMat);
    cabin.position.set(0, 1.9, -0.4);
    car.add(cabin);

    // Glowing LED Matrix Headlights
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    [-0.95, 0.95].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.08), ledMat);
      hl.position.set(hx, 1.1, 2.62);
      car.add(hl);
    });

    // Big Alloy Wheels
    [-1.3, 1.3].forEach(wx => {
      [-1.5, 1.5].forEach(wz => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.35, 14), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.48, wz);
        car.add(wheel);
      });
    });

    car.position.set(x, 0, z);
    return car;
  }

  // --- REUSABLE ENVIRONMENT PROPS ---
  createTree(x, z, scale = 1.0) {
    const group = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4 * scale, 0.55 * scale, 4.5 * scale, 8), trunkMat);
    trunk.position.set(0, 2.25 * scale, 0);
    trunk.castShadow = true;
    group.add(trunk);

    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });
    const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(2.6 * scale, 1), foliageMat);
    foliage.position.set(0, 5.0 * scale, 0);
    foliage.castShadow = true;
    group.add(foliage);

    group.position.set(x, 0, z);
    this.scene.add(group);
    return group;
  }

  createBench(x, z) {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.5 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 0.7), woodMat);
    seat.position.set(0, 0.55, 0);
    seat.castShadow = true;
    group.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.6, 0.1), woodMat);
    back.position.set(0, 1.0, -0.3);
    group.add(back);

    [-1.1, 1.1].forEach(lx => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.6), woodMat);
      leg.position.set(lx, 0.28, 0);
      group.add(leg);
    });

    group.position.set(x, 0, z);
    this.scene.add(group);
    return group;
  }

  createChair(x, z, rotY = 0) {
    const chair = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x92400e });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.8), mat);
    seat.position.y = 0.75;
    chair.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.08), mat);
    back.position.set(0, 1.2, -0.36);
    chair.add(back);

    chair.position.set(x, 0, z);
    chair.rotation.y = rotY;
    return chair;
  }

  createScooter(x, z) {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 1.8), bodyMat);
    body.position.set(0, 0.6, 0);
    group.add(body);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.9), blackMat);
    seat.position.set(0, 1.0, -0.15);
    group.add(seat);

    // Glowing scooter headlight
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    hl.position.set(0, 0.8, 0.95);
    group.add(hl);

    const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.18, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    const frontWheel = new THREE.Mesh(wheelGeo, blackMat);
    frontWheel.position.set(0, 0.28, 0.9);
    const rearWheel = new THREE.Mesh(wheelGeo, blackMat);
    rearWheel.position.set(0, 0.28, -0.8);
    group.add(frontWheel, rearWheel);

    group.position.set(x, 0, z);
    this.scene.add(group);
    return group;
  }

  createBicycleRack(x, z) {
    const rack = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.4 });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.8, 0.1), metalMat);
    bar.position.y = 0.4;
    rack.add(bar);

    [-1.2, 0, 1.2].forEach(bx => {
      const bike = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.9, 1.6), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      bike.position.set(bx, 0.45, 0);
      rack.add(bike);
    });

    rack.position.set(x, 0, z);
    this.scene.add(rack);
    return rack;
  }

  createFlowerbed(x, z) {
    const bed = new THREE.Group();
    const dirt = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.8, 0.25, 12),
      new THREE.MeshStandardMaterial({ color: 0x3f2e1e, roughness: 0.9 })
    );
    dirt.position.y = 0.12;
    bed.add(dirt);

    // Colorful Flower clusters
    const flowerColors = [0xec4899, 0xf43f5e, 0xfbbf24, 0xa855f7];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const fl = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 6, 6),
        new THREE.MeshStandardMaterial({ color: flowerColors[i % flowerColors.length] })
      );
      fl.position.set(Math.cos(angle) * 1.0, 0.32, Math.sin(angle) * 1.0);
      bed.add(fl);
    }
    bed.position.set(x, 0, z);
    this.scene.add(bed);
    return bed;
  }

  createPottedPlant(x, z) {
    const potGroup = new THREE.Group();
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.3, 0.7, 8),
      new THREE.MeshStandardMaterial({ color: 0xc2410c })
    );
    pot.position.y = 0.35;
    potGroup.add(pot);

    const plant = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.55, 1),
      new THREE.MeshStandardMaterial({ color: 0x15803d })
    );
    plant.position.y = 0.9;
    potGroup.add(plant);

    potGroup.position.set(x, 0, z);
    this.scene.add(potGroup);
    return potGroup;
  }

  createLockers(x, z) {
    const group = new THREE.Group();
    const lockerMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.6, roughness: 0.4 });
    const bank = new THREE.Mesh(new THREE.BoxGeometry(0.6, 5.0, 3.2), lockerMat);
    bank.position.y = 2.5;
    group.add(bank);

    group.position.set(x, 0, z);
    this.scene.add(group);
    return group;
  }

  createStreetFoodCart(x, z) {
    const cart = new THREE.Group();
    const cartBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 2.2), new THREE.MeshStandardMaterial({ color: 0xb45309 }));
    cartBody.position.y = 0.7;
    cart.add(cartBody);

    const kettle = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9 }));
    kettle.position.set(0, 1.45, 0);
    cart.add(kettle);

    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    lantern.position.set(0, 2.1, 0);
    cart.add(lantern);

    const lanternLight = new THREE.PointLight(0xfef08a, 2.5, 10);
    lanternLight.position.set(0, 2.1, 0);
    cart.add(lanternLight);

    cart.position.set(x, 0, z);
    this.scene.add(cart);
    return cart;
  }

  createCafePatio(x, z) {
    const patio = new THREE.Group();
    const table = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.1, 14), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 }));
    table.position.y = 1.0;
    patio.add(table);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 6), new THREE.MeshStandardMaterial({ color: 0x64748b }));
    pole.position.y = 0.5;
    patio.add(pole);

    // Glowing Patio Heater
    const heater = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.8, 8), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    heater.position.set(-2, 1.4, -1);
    patio.add(heater);

    const heaterFlame = new THREE.PointLight(0xf97316, 2.8, 10);
    heaterFlame.position.set(-2, 2.6, -1);
    patio.add(heaterFlame);

    patio.position.set(x, 0, z);
    this.scene.add(patio);
    return patio;
  }

  createStreetLamp(x, z) {
    const lamp = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 7, 8), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    pole.position.y = 3.5;
    lamp.add(pole);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    bulb.position.set(0, 7, 0);
    lamp.add(bulb);

    const light = new THREE.PointLight(0xfef08a, 3.0, 18);
    light.position.set(0, 6.8, 0);
    lamp.add(light);

    lamp.position.set(x, 0, z);
    this.scene.add(lamp);
    return lamp;
  }

  createBusShelter(x, z) {
    const shelter = new THREE.Group();
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 3.5, 4.0),
      new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.5, roughness: 0.1 })
    );
    glass.position.y = 1.75;
    shelter.add(glass);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.2, 4.2), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    roof.position.set(-1.0, 3.5, 0);
    shelter.add(roof);

    shelter.position.set(x, 0, z);
    this.scene.add(shelter);
    return shelter;
  }

  createInteractionHalo(x, y, z, color = 0xd4af37) {
    const ringGeo = new THREE.RingGeometry(0.9, 1.3, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, y, z);
    this.scene.add(ring);
    this.activeObjects.push(ring);
    this.haloRing = ring;
  }

  createFallingLeaves() {
    const count = 180;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.25,
      transparent: true,
      opacity: 0.9
    });
    this.particles = new THREE.Points(geo, mat);
    this.particleType = 'leaves';
    this.scene.add(this.particles);
  }

  createRain(count = 1000, opacity = 0.5) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = Math.random() * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 45;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: 0.14,
      transparent: true,
      opacity: opacity
    });
    this.rainParticles = new THREE.Points(geo, mat);
    this.scene.add(this.rainParticles);
  }

  createRainSplashes() {
    const count = 300;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = 0.05;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.35,
      transparent: true,
      opacity: 0.7
    });
    this.rainSplashParticles = new THREE.Points(geo, mat);
    this.scene.add(this.rainSplashParticles);
  }

  createCitySkyline() {
    const cityGroup = new THREE.Group();
    const bldgMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      emissive: 0x0f172a,
      roughness: 0.8
    });
    const winMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    for (let i = 0; i < 50; i++) {
      const h = 12 + Math.random() * 28;
      const w = 2.5 + Math.random() * 5.0;
      const bldg = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), bldgMat);
      const angle = (i / 50) * Math.PI * 1.5 - Math.PI * 0.75;
      const dist = 36 + Math.random() * 16;
      bldg.position.set(Math.sin(angle) * dist, h / 2 - 8, Math.cos(angle) * dist);
      cityGroup.add(bldg);

      // Lighted window rows
      if (i % 2 === 0) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.4, w * 0.85), winMat);
        win.position.set(Math.sin(angle) * dist, h * 0.7 - 8, Math.cos(angle) * dist);
        cityGroup.add(win);
      }
    }
    this.scene.add(cityGroup);
    this.activeObjects.push(cityGroup);
  }

  createStarrySky() {
    const count = 600;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = 14 + Math.random() * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 140;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.32, transparent: true, opacity: 0.95 });
    const stars = new THREE.Points(geo, mat);
    this.scene.add(stars);
    this.activeObjects.push(stars);
  }

  update(delta) {
    if (this.haloRing) {
      const s = 1.0 + Math.sin(Date.now() * 0.005) * 0.15;
      this.haloRing.scale.set(s, s, s);
    }

    // Rotating turntable in luxury car showroom
    if (this.turntable) {
      this.turntable.rotation.y += delta * 0.4;
    }

    // Floating crystal animation in epilogue
    if (this.floatingCrystals.length > 0) {
      const time = Date.now() * 0.002;
      this.floatingCrystals.forEach((c, i) => {
        c.rotation.x += delta * 1.4;
        c.rotation.y += delta * 1.8;
        c.position.y = 1.8 + Math.sin(time + i * 1.2) * 0.3;
      });
    }

    // Falling leaves
    if (this.particles && this.particleType === 'leaves') {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= delta * 1.4;
        if (positions[i] < 0) positions[i] = 12;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    // Rain drop physics
    if (this.rainParticles) {
      const positions = this.rainParticles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= delta * 28.0;
        if (positions[i] < 0) positions[i] = 18;
      }
      this.rainParticles.geometry.attributes.position.needsUpdate = true;
    }

    // Rain puddle splash pulses
    if (this.rainSplashParticles) {
      const mat = this.rainSplashParticles.material;
      mat.opacity = 0.4 + Math.sin(Date.now() * 0.015) * 0.3;
    }
  }
}
