import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import cardImages from '../data/cardImages';

const CARD_IDS = [
  'lobo','vidente','bruja','cazador','cupido','protector',
  'ninia','angel','zorro','caballero','aldeano','juez',
  'nino','sectario','gemelas','anciano','albino','padre',
  'perrolobo','gitana','feroz',
];

export function useThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0608, 1);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 30);

    // ── Moon ─────────────────────────────────────────────────
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(5, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0xf5e6c8, roughness: 0.9, metalness: 0,
        emissive: new THREE.Color(0xc9a84c), emissiveIntensity: 0.15,
      })
    );
    moon.position.set(10, 10, -20);
    scene.add(moon);
    moon.add(new THREE.Mesh(
      new THREE.SphereGeometry(5.8, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.06, side: THREE.BackSide })
    ));
    const moonLight = new THREE.PointLight(0xf5e0b0, 1.8, 120);
    moonLight.position.copy(moon.position);
    scene.add(moonLight);
    scene.add(new THREE.AmbientLight(0x1a0a20, 0.8));

    // ── Stars ─────────────────────────────────────────────────
    const STAR_COUNT = 1800;
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 80 + Math.random() * 20;
      starPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i*3+2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xf5e6c8, size: 0.18, transparent: true, opacity: 0.85, sizeAttenuation: true })
    );
    scene.add(stars);

    // ── Fog particles ─────────────────────────────────────────
    const FOG_COUNT = 120;
    const fogPosArr = new Float32Array(FOG_COUNT * 3);
    const fogPhase: number[] = [];
    for (let i = 0; i < FOG_COUNT; i++) {
      fogPosArr[i*3]   = (Math.random() - 0.5) * 60;
      fogPosArr[i*3+1] = (Math.random() - 0.5) * 40;
      fogPosArr[i*3+2] = (Math.random() - 0.5) * 20;
      fogPhase.push(Math.random() * Math.PI * 2);
    }
    const fogGeo = new THREE.BufferGeometry();
    fogGeo.setAttribute('position', new THREE.BufferAttribute(fogPosArr, 3));
    const fogMat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.12, transparent: true, opacity: 0.35, sizeAttenuation: true });
    scene.add(new THREE.Points(fogGeo, fogMat));

    // ── Circular Card Gallery ─────────────────────────────────
    const RING_R   = 22;
    const RING_Z   = -42;
    const CARD_W   = 4.8;
    const CARD_H   = 6.8;
    const loader   = new THREE.TextureLoader();
    const cardMeshes: Array<{ mesh: THREE.Mesh; frame: THREE.Mesh; baseAngle: number }> = [];

    CARD_IDS.forEach((id, i) => {
      const baseAngle = (i / CARD_IDS.length) * Math.PI * 2;
      const x = Math.sin(baseAngle) * RING_R;
      const z = Math.cos(baseAngle) * RING_R + RING_Z;

      // Frame (gold border)
      const frameMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(CARD_W + 0.2, CARD_H + 0.2),
        new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
      );
      frameMesh.position.set(x, 0, z - 0.05);

      const cardMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide });
      const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(CARD_W, CARD_H), cardMat);
      cardMesh.position.set(x, 0, z);

      // Face inward toward camera origin
      const lookTarget = new THREE.Vector3(0, 0, RING_Z + RING_R * 0.5);
      cardMesh.lookAt(lookTarget);
      frameMesh.lookAt(lookTarget);

      const src = (cardImages as Record<string, string>)[id];
      if (src) {
        loader.load(src, (tex) => {
          tex.minFilter = THREE.LinearFilter;
          cardMat.map = tex;
          cardMat.opacity = 0.5;
          cardMat.needsUpdate = true;
        });
      } else {
        cardMat.color.set(0x1a0a10);
        cardMat.opacity = 0.3;
      }

      scene.add(frameMesh);
      scene.add(cardMesh);
      cardMeshes.push({ mesh: cardMesh, frame: frameMesh, baseAngle });
    });

    // ── Torus knot (decorative) ───────────────────────────────
    const torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(3, 0.35, 120, 16, 2, 3),
      new THREE.MeshStandardMaterial({
        color: 0x8b0000, roughness: 0.4, metalness: 0.6,
        emissive: new THREE.Color(0x3a0000), emissiveIntensity: 0.5,
        transparent: true, opacity: 0.5,
      })
    );
    torusKnot.position.set(-14, -8, -10);
    scene.add(torusKnot);

    // ── Resize ────────────────────────────────────────────────
    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);
    onResize();

    let mx = 0, my = 0;
    function onMouseMove(e: MouseEvent) {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', onMouseMove);

    let scrollY = 0;
    function onScroll() { scrollY = window.scrollY; }
    window.addEventListener('scroll', onScroll);

    // ── Animate ───────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId  = 0;
    const RING_SPEED = 0.06; // rad/s

    function animate() {
      animId = requestAnimationFrame(animate);
      const t   = clock.getElapsedTime();
      const rot = t * RING_SPEED;

      // Moon pulse
      (moon.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.12 + 0.06 * Math.sin(t * 0.4);

      // Torus knot spin
      torusKnot.rotation.x = t * 0.18;
      torusKnot.rotation.y = t * 0.12;

      // Fog sway
      const fp = fogGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < FOG_COUNT; i++) {
        fp[i*3+1] += Math.sin(t * 0.6 + fogPhase[i]) * 0.003;
        fp[i*3]   += Math.cos(t * 0.4 + fogPhase[i]) * 0.002;
      }
      fogGeo.attributes.position.needsUpdate = true;
      fogMat.opacity = 0.25 + 0.12 * Math.sin(t * 0.5);

      // Circular gallery rotation
      const lookTarget = new THREE.Vector3(0, 0, RING_Z + RING_R * 0.5);
      cardMeshes.forEach(({ mesh, frame, baseAngle }, i) => {
        const angle = baseAngle + rot;
        const x = Math.sin(angle) * RING_R;
        const z = Math.cos(angle) * RING_R + RING_Z;
        const y = Math.sin(t * 0.3 + i * 0.4) * 0.5;

        mesh.position.set(x, y, z);
        frame.position.set(x, y, z - 0.05);
        mesh.lookAt(lookTarget);
        frame.lookAt(lookTarget);

        // Closer cards are bigger and more opaque
        const frontness = Math.max(0, Math.cos(angle)); // 0–1
        const s = 0.7 + 0.55 * frontness;
        mesh.scale.setScalar(s);
        frame.scale.setScalar(s);
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat.map) mat.opacity = 0.15 + 0.55 * frontness;
        const fm = frame.material as THREE.MeshBasicMaterial;
        fm.opacity = 0.08 + 0.25 * frontness;
      });

      // Camera parallax
      camera.position.y  = -scrollY * 0.008;
      camera.rotation.x += (-my * 0.03 - camera.rotation.x) * 0.04;
      camera.rotation.y += ( mx * 0.03 - camera.rotation.y) * 0.04;

      stars.rotation.y = t * 0.005;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
    };
  }, []);

  return canvasRef;
}
