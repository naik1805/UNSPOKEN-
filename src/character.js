/* ========================================================
   UNSPOKEN: Detailed 3D Characters & Stylized Models
   Feminine girl model with hair, skirt, eyes & blush; tailored boy model.
   ======================================================== */

import * as THREE from 'three';

export class CharacterController {
  constructor(scene, isPlayer = true, outfitType = 'school_boy') {
    this.scene = scene;
    this.isPlayer = isPlayer;
    this.outfitType = outfitType;

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = 0;
    this.targetRotation = 0;
    this.speed = 6.5;
    this.isMoving = false;
    this.animTime = 0;

    this.mesh = this.buildModel(outfitType);
    this.scene.add(this.mesh);
  }

  buildModel(outfit) {
    const root = new THREE.Group();
    const isGirl = outfit.includes('girl');

    // Color Palettes
    let jacketColor = 0x2563eb; // Royal blue SVEC blazer for boy
    let pantsColor = 0x334155;   // Slate trousers
    let skirtColor = 0xbe185d;   // Rose/magenta pleated SVEC uniform skirt
    let skinColor = 0xfde2cb;    // Bright natural warm skin
    let hairColor = 0x18181b;    // Jet black hair
    let shoeColor = 0x0f172a;
    let backpackColor = 0x0284c7;

    if (outfit === 'school_girl') {
      jacketColor = 0xffffff;   // Crisp white school shirt
      skirtColor = 0xe11d48;    // Vibrant rose SVEC school skirt
      hairColor = 0x27272a;     // Soft dark brown
    } else if (outfit === 'tuition_teen') {
      jacketColor = 0xd97706;  // Warm amber knit sweater
      pantsColor = 0x334155;
      backpackColor = 0xf59e0b;
    } else if (outfit === 'tuition_girl') {
      jacketColor = 0xf472b6;  // Soft pink cardigan
      skirtColor = 0x475569;
      hairColor = 0x27272a;
    } else if (outfit === 'adult_casual') {
      jacketColor = 0x3b82f6;  // Clean blue jacket
      pantsColor = 0x1e293b;
    } else if (outfit === 'girl_adult') {
      jacketColor = 0xf43f5e;  // Stylish rose coat
      skirtColor = 0x0f172a;
      hairColor = 0x18181b;
    } else if (outfit === 'girl_umbrella') {
      jacketColor = 0x0f172a;  // Midnight black drenched coat
      skirtColor = 0x1e293b;
    } else if (outfit === 'heartbroken') {
      jacketColor = 0x475569;  // Drenched grey jacket
      pantsColor = 0x0f172a;
    }

    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.5 });
    const clothesMat = new THREE.MeshStandardMaterial({ color: jacketColor, roughness: 0.5 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.6 });
    const skirtMat = new THREE.MeshStandardMaterial({ color: skirtColor, roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: shoeColor, roughness: 0.5 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const blushMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.6 });

    // --- Hips ---
    this.hips = new THREE.Group();
    this.hips.position.y = 1.0;
    root.add(this.hips);

    if (isGirl) {
      // Feminine slender waist & torso
      const torsoGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.55, 10);
      this.torso = new THREE.Mesh(torsoGeo, clothesMat);
      this.torso.position.y = 0.32;
      this.torso.castShadow = true;
      this.hips.add(this.torso);

      // Flared pleated skirt
      const skirtGeo = new THREE.CylinderGeometry(0.18, 0.36, 0.45, 12);
      const skirt = new THREE.Mesh(skirtGeo, skirtMat);
      skirt.position.y = -0.15;
      skirt.castShadow = true;
      this.hips.add(skirt);
    } else {
      // Masculine torso
      const torsoGeo = new THREE.CylinderGeometry(0.24, 0.20, 0.65, 8);
      this.torso = new THREE.Mesh(torsoGeo, clothesMat);
      this.torso.position.y = 0.35;
      this.torso.castShadow = true;
      this.hips.add(this.torso);

      // White shirt collar & tie
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.1, 6), whiteMat);
      collar.position.y = 0.34;
      this.torso.add(collar);

      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.04), new THREE.MeshStandardMaterial({ color: 0xb91c1c }));
      tie.position.set(0, 0.16, 0.19);
      this.torso.add(tie);
    }

    // --- Neck & Head ---
    const neckGeo = new THREE.CylinderGeometry(isGirl ? 0.06 : 0.08, isGirl ? 0.07 : 0.08, 0.12, 8);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = isGirl ? 0.32 : 0.38;
    this.torso.add(neck);

    this.head = new THREE.Group();
    this.head.position.y = 0.12;
    neck.add(this.head);

    const headGeo = new THREE.SphereGeometry(isGirl ? 0.20 : 0.22, 14, 14);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.head.add(headMesh);

    // Expressive Eyes (Front facing +Z)
    [-0.07, 0.07].forEach(eyeX => {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.04, 0.02), eyeMat);
      eye.position.set(eyeX, 0.02, 0.19);
      this.head.add(eye);
    });

    // Rosy Cheeks Blush (for Girl)
    if (isGirl) {
      [-0.11, 0.11].forEach(blushX => {
        const blush = new THREE.Mesh(new THREE.CircleGeometry(0.04, 8), blushMat);
        blush.position.set(blushX, -0.04, 0.185);
        blush.rotation.y = blushX > 0 ? -0.2 : 0.2;
        this.head.add(blush);
      });
    }

    // --- HAIR STYLING ---
    if (isGirl) {
      // Girl's Hair Dome with bangs
      const hairDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.23, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.65),
        hairMat
      );
      hairDome.position.y = 0.04;
      this.head.add(hairDome);

      // Long Hair Locks falling over shoulders
      [-0.14, 0.14].forEach(lockX => {
        const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.55, 6), hairMat);
        lock.position.set(lockX, -0.16, 0.04);
        lock.rotation.z = lockX > 0 ? -0.15 : 0.15;
        this.head.add(lock);
      });

      // Flowing Back Hair
      const backHair = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.65, 0.12), hairMat);
      backHair.position.set(0, -0.20, -0.16);
      backHair.rotation.x = -0.1;
      this.head.add(backHair);

      // Hair Ribbon / Bow
      const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 });
      const ribbonCenter = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), ribbonMat);
      ribbonCenter.position.set(0, 0.16, -0.16);
      this.head.add(ribbonCenter);

      [-0.08, 0.08].forEach(rx => {
        const bowWing = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 6), ribbonMat);
        bowWing.position.set(rx, 0.16, -0.16);
        bowWing.rotation.z = rx > 0 ? -Math.PI / 2.5 : Math.PI / 2.5;
        this.head.add(bowWing);
      });

      // School Notebook held in arms (for SVEC & Tuition)
      if (outfit === 'school_girl' || outfit === 'tuition_girl') {
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.24, 0.32, 0.08),
          new THREE.MeshStandardMaterial({ color: 0xf472b6 })
        );
        book.position.set(0, 0.15, 0.22);
        book.rotation.x = 0.2;
        this.torso.add(book);
      }

      // Midnight Umbrella (for Breakup Crossroads)
      if (outfit === 'girl_umbrella') {
        const umbrellaGroup = new THREE.Group();
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 6), new THREE.MeshStandardMaterial({ color: 0x334155 }));
        stick.position.y = 0.7;
        umbrellaGroup.add(stick);

        const canopy = new THREE.Mesh(
          new THREE.ConeGeometry(0.95, 0.38, 14, 1, true),
          new THREE.MeshStandardMaterial({ color: 0x090d16, side: THREE.DoubleSide, roughness: 0.2, metalness: 0.5 })
        );
        canopy.position.y = 1.3;
        umbrellaGroup.add(canopy);

        umbrellaGroup.position.set(0.35, 0.2, 0.15);
        this.torso.add(umbrellaGroup);
      }
    } else {
      // Boy's Short Styled Hair
      const hairDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.55),
        hairMat
      );
      hairDome.position.y = 0.05;
      this.head.add(hairDome);

      // Backpack
      if (this.isPlayer && (outfit === 'school_boy' || outfit === 'tuition_teen')) {
        const bagGeo = new THREE.BoxGeometry(0.34, 0.44, 0.22);
        const bagMat = new THREE.MeshStandardMaterial({ color: backpackColor });
        const backpack = new THREE.Mesh(bagGeo, bagMat);
        backpack.position.set(0, 0.04, -0.22);
        backpack.castShadow = true;
        this.torso.add(backpack);

        // Backpack Straps
        [-0.12, 0.12].forEach(sx => {
          const strap = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.35, 0.04), bagMat);
          strap.position.set(sx, 0.08, 0.14);
          this.torso.add(strap);
        });
      }
    }

    // --- Arms & Limbs ---
    const armRadius = isGirl ? 0.05 : 0.07;
    const armGeo = new THREE.CylinderGeometry(armRadius, armRadius * 0.9, 0.48, 6);

    // Left Arm
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(isGirl ? -0.24 : -0.28, isGirl ? 0.20 : 0.25, 0);
    this.torso.add(this.leftArm);
    const lArmMesh = new THREE.Mesh(armGeo, clothesMat);
    lArmMesh.position.y = -0.22;
    lArmMesh.castShadow = true;
    this.leftArm.add(lArmMesh);
    const lHand = new THREE.Mesh(new THREE.SphereGeometry(armRadius * 0.9, 6, 6), skinMat);
    lHand.position.y = -0.46;
    this.leftArm.add(lHand);

    // Right Arm
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(isGirl ? 0.24 : 0.28, isGirl ? 0.20 : 0.25, 0);
    this.torso.add(this.rightArm);
    const rArmMesh = new THREE.Mesh(armGeo, clothesMat);
    rArmMesh.position.y = -0.22;
    rArmMesh.castShadow = true;
    this.rightArm.add(rArmMesh);
    const rHand = new THREE.Mesh(new THREE.SphereGeometry(armRadius * 0.9, 6, 6), skinMat);
    rHand.position.y = -0.46;
    this.rightArm.add(rHand);

    // Legs
    const legRadius = isGirl ? 0.06 : 0.08;
    const legMat = isGirl ? (outfit === 'school_girl' ? skinMat : pantsMat) : pantsMat;
    const legGeo = new THREE.CylinderGeometry(legRadius, legRadius * 0.85, 0.65, 6);

    // Left Leg
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(isGirl ? -0.10 : -0.12, 0, 0);
    this.hips.add(this.leftLeg);
    const lLegMesh = new THREE.Mesh(legGeo, legMat);
    lLegMesh.position.y = -0.32;
    lLegMesh.castShadow = true;
    this.leftLeg.add(lLegMesh);

    // White school socks for girl
    if (isGirl && outfit === 'school_girl') {
      const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.25, 6), whiteMat);
      sock.position.y = -0.42;
      this.leftLeg.add(sock);
    }

    const lFoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.20), shoeMat);
    lFoot.position.set(0, -0.66, 0.04);
    this.leftLeg.add(lFoot);

    // Right Leg
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(isGirl ? 0.10 : 0.12, 0, 0);
    this.hips.add(this.rightLeg);
    const rLegMesh = new THREE.Mesh(legGeo, legMat);
    rLegMesh.position.y = -0.32;
    rLegMesh.castShadow = true;
    this.rightLeg.add(rLegMesh);

    if (isGirl && outfit === 'school_girl') {
      const sockR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.25, 6), whiteMat);
      sockR.position.y = -0.42;
      this.rightLeg.add(sockR);
    }

    const rFoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.20), shoeMat);
    rFoot.position.set(0, -0.66, 0.04);
    this.rightLeg.add(rFoot);

    return root;
  }

  updateOutfit(newOutfit) {
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }
    this.outfitType = newOutfit;
    this.mesh = this.buildModel(newOutfit);
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.rotation;
    this.scene.add(this.mesh);
  }

  update(delta, inputVector = null) {
    this.animTime += delta;

    if (inputVector && (inputVector.x !== 0 || inputVector.y !== 0)) {
      this.isMoving = true;

      // In Three.js: when facing -Z, angle is PI.
      const angle = Math.atan2(inputVector.x, inputVector.y);
      this.targetRotation = angle;

      // Smooth shortest-path rotation interpolation
      let diff = this.targetRotation - this.rotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.rotation += diff * Math.min(1.0, delta * 14.0);

      // Move forward in facing direction
      const moveDistance = this.speed * delta;
      this.position.x += Math.sin(this.targetRotation) * moveDistance;
      this.position.z += Math.cos(this.targetRotation) * moveDistance;
    } else {
      this.isMoving = false;
    }

    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.rotation;

    // --- PROCEDURAL SKELETAL WALK CYCLE ---
    if (this.isMoving) {
      const walkFreq = 9.5;
      const walkAngle = Math.sin(this.animTime * walkFreq) * 0.65;

      this.leftLeg.rotation.x = walkAngle;
      this.rightLeg.rotation.x = -walkAngle;

      this.leftArm.rotation.x = -walkAngle * 0.8;
      this.rightArm.rotation.x = walkAngle * 0.8;

      this.hips.position.y = 1.0 + Math.abs(Math.sin(this.animTime * walkFreq)) * 0.08;
      this.torso.rotation.y = Math.sin(this.animTime * walkFreq) * 0.08;
    } else {
      // Gentle idle breathing
      const idleFreq = 2.0;
      const breathe = Math.sin(this.animTime * idleFreq) * 0.025;

      this.hips.position.y = 1.0 + breathe;
      this.torso.rotation.x = breathe * 0.4;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;

      // Subtle arm breathing
      this.leftArm.rotation.x = Math.sin(this.animTime * idleFreq) * 0.04;
      this.rightArm.rotation.x = -Math.sin(this.animTime * idleFreq) * 0.04;
    }
  }

  lookAt(targetVec) {
    const dir = new THREE.Vector3().subVectors(targetVec, this.position);
    this.rotation = Math.atan2(dir.x, dir.z);
    this.targetRotation = this.rotation;
    this.mesh.rotation.y = this.rotation;
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z);
    this.mesh.position.set(x, y, z);
  }

  destroy() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }
  }
}
