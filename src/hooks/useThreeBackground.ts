import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0608, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 30);

    // ── Moon ──────────────────────────────────────────────────
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(5, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0xf5e6c8,
        roughness: 0.9,
        metalness: 0.0,
        emissive: new THREE.Color(0xc9a84c),
        emissiveIntensity: 0.15,
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
      starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
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
      fogPosArr[i * 3]     = (Math.random() - 0.5) * 60;
      fogPosArr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      fogPosArr[i * 3 + 2] = (Math.random() - 0.5) * 20;
      fogPhase.push(Math.random() * Math.PI * 2);
    }
    const fogGeo = new THREE.BufferGeometry();
    fogGeo.setAttribute('position', new THREE.BufferAttribute(fogPosArr, 3));
    const fogMat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.12, transparent: true, opacity: 0.35, sizeAttenuation: true });
    const fogParticles = new THREE.Points(fogGeo, fogMat);
    scene.add(fogParticles);

    // ── Torus knot ────────────────────────────────────────────
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

    // ── Mouse tilt ────────────────────────────────────────────
    let mx = 0, my = 0;
    function onMouseMove(e: MouseEvent) {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', onMouseMove);

    // ── Scroll parallax ───────────────────────────────────────
    let scrollY = 0;
    function onScroll() { scrollY = window.scrollY; }
    window.addEventListener('scroll', onScroll);

    // ── Animate ───────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      (moon.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.12 + 0.06 * Math.sin(t * 0.4);

      torusKnot.rotation.x = t * 0.18;
      torusKnot.rotation.y = t * 0.12;

      const fp = fogGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < FOG_COUNT; i++) {
        fp[i * 3 + 1] += Math.sin(t * 0.6 + fogPhase[i]) * 0.003;
        fp[i * 3]     += Math.cos(t * 0.4 + fogPhase[i]) * 0.002;
      }
      fogGeo.attributes.position.needsUpdate = true;
      fogMat.opacity = 0.25 + 0.12 * Math.sin(t * 0.5);

      camera.position.y = -scrollY * 0.008;
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
