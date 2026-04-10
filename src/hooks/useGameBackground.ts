import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import cardImages from '../data/cardImages';

export type TimeOfDay = 'night' | 'day';

interface Options {
  timeOfDay: TimeOfDay;
  bgCardRole?: string | null;
}

export function phaseToRoleId(phase: string): string | null {
  if (phase === 'night-wolves' || phase === 'night-announce') return 'lobo';
  if (phase === 'night-role-feroz')      return 'feroz';
  if (phase === 'night-role-padre')      return 'padre';
  if (phase === 'night-role-albino')     return 'albino';
  if (phase === 'night-role-perrolobo')  return 'perrolobo';
  if (phase === 'night-role-vidente')    return 'vidente';
  if (phase === 'night-role-bruja')      return 'bruja';
  if (phase === 'night-role-protector')  return 'protector';
  if (phase === 'night-role-cupido')     return 'cupido';
  if (phase === 'night-role-zorro')      return 'zorro';
  if (phase === 'night-role-nino')       return 'nino';
  if (phase === 'night-role-gemelas')    return 'gemelas';
  if (phase === 'night-girl-hint')       return 'ninia';
  if (phase === 'day-hunter-night' || phase === 'day-hunter-day') return 'cazador';
  if (phase === 'day-caballero')         return 'caballero';
  if (phase === 'day-judge-second-vote') return 'juez';
  if (phase === 'day-debate')            return null;
  if (phase === 'day-vote')              return null;
  return null;
}

export function useGameBackground({ timeOfDay, bgCardRole }: Options) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef({ timeOfDay, bgCardRole });
  useEffect(() => { stateRef.current = { timeOfDay, bgCardRole }; }, [timeOfDay, bgCardRole]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0608, 1);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 300);
    camera.position.set(0, 0, 30);

    // ── Ambient + hemisphere light ────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a0a20, 0.8));
    const hemi = new THREE.HemisphereLight(0x1a0a20, 0x0a0608, 0.5);
    scene.add(hemi);

    // ── Stars ─────────────────────────────────────────────────
    const STARS = 1800;
    const starArr = new Float32Array(STARS * 3);
    for (let i = 0; i < STARS; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r  = 80 + Math.random() * 20;
      starArr[i*3]   = r * Math.sin(ph) * Math.cos(th);
      starArr[i*3+1] = r * Math.sin(ph) * Math.sin(th);
      starArr[i*3+2] = r * Math.cos(ph);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starArr, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xf5e6c8, size: 0.18, transparent: true, opacity: 0.85, sizeAttenuation: true });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Fog particles ─────────────────────────────────────────
    const FOG = 120;
    const fogArr = new Float32Array(FOG * 3);
    const fogPh: number[] = [];
    for (let i = 0; i < FOG; i++) {
      fogArr[i*3]   = (Math.random() - 0.5) * 60;
      fogArr[i*3+1] = (Math.random() - 0.5) * 40;
      fogArr[i*3+2] = (Math.random() - 0.5) * 20;
      fogPh.push(Math.random() * Math.PI * 2);
    }
    const fogGeo = new THREE.BufferGeometry();
    fogGeo.setAttribute('position', new THREE.BufferAttribute(fogArr, 3));
    const fogMat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.12, transparent: true, opacity: 0.35, sizeAttenuation: true });
    const fogParticles = new THREE.Points(fogGeo, fogMat);
    scene.add(fogParticles);

    // ── Torus knot (original decorative element) ──────────────
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

    // ── MOON — much more visible ──────────────────────────────
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xf5e6c8, roughness: 0.85, metalness: 0.05,
      emissive: new THREE.Color(0xc9a84c), emissiveIntensity: 0.55,
    });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(6.5, 64, 64), moonMat);
    scene.add(moon);

    // Moon glow layers
    const moonGlow1 = new THREE.Mesh(
      new THREE.SphereGeometry(7.8, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.12, side: THREE.BackSide })
    );
    const moonGlow2 = new THREE.Mesh(
      new THREE.SphereGeometry(10.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.05, side: THREE.BackSide })
    );
    moon.add(moonGlow1);
    moon.add(moonGlow2);

    const moonLight = new THREE.PointLight(0xf5e0b0, 4.5, 200);
    scene.add(moonLight);

    // ── SUN — much more visible ───────────────────────────────
    const sunMat = new THREE.MeshStandardMaterial({
      color: 0xffd060, roughness: 0.3, metalness: 0.1,
      emissive: new THREE.Color(0xff8800), emissiveIntensity: 1.2,
    });
    const sun = new THREE.Mesh(new THREE.SphereGeometry(7, 64, 64), sunMat);
    scene.add(sun);

    // Sun corona rings
    const coronaRings: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(9 + i * 2.2, 0.22 - i * 0.04, 16, 120),
        new THREE.MeshBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.14 - i * 0.03 })
      );
      sun.add(ring);
      coronaRings.push(ring);
    }

    // Sun glow layers
    const sunGlow1 = new THREE.Mesh(
      new THREE.SphereGeometry(9, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.18, side: THREE.BackSide })
    );
    const sunGlow2 = new THREE.Mesh(
      new THREE.SphereGeometry(13, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.07, side: THREE.BackSide })
    );
    sun.add(sunGlow1);
    sun.add(sunGlow2);

    const sunLight = new THREE.PointLight(0xffcc55, 5.0, 250);
    scene.add(sunLight);

    // ── Background card (small, off-center) ───────────────────
    // Smaller & positioned right side, more opacity
    const CARD_W = 11, CARD_H = 15.5;
    const cardGeo  = new THREE.PlaneGeometry(CARD_W, CARD_H);
    const cardMat  = new THREE.MeshBasicMaterial({
      transparent: true, opacity: 0, side: THREE.DoubleSide,
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    // Positioned bottom-right, slightly rotated
    cardMesh.position.set(12, -5, -5);
    cardMesh.rotation.z = -0.12;
    scene.add(cardMesh);

    // Gold border frame for the card
    const frameMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0, side: THREE.DoubleSide });
    const frameMesh = new THREE.Mesh(new THREE.PlaneGeometry(CARD_W + 0.3, CARD_H + 0.3), frameMat);
    frameMesh.position.set(12, -5, -5.1);
    frameMesh.rotation.z = -0.12;
    scene.add(frameMesh);

    const loader = new THREE.TextureLoader();
    let currentCardRole = '';
    let cardOpacityTarget = 0;

    function loadCard(roleId: string | null) {
      if (!roleId) { cardOpacityTarget = 0; currentCardRole = ''; return; }
      if (roleId === currentCardRole) return;
      currentCardRole = roleId;
      const src = (cardImages as Record<string, string>)[roleId];
      if (!src) { cardOpacityTarget = 0; return; }
      loader.load(src, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        cardMat.map = tex;
        cardMat.needsUpdate = true;
        cardOpacityTarget = 0.35; // more visible
      });
    }

    // ── Resize ────────────────────────────────────────────────
    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    let mx = 0, my = 0;
    function onMouse(e: MouseEvent) {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', onMouse);

    // ── Animate ───────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId  = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t   = clock.getElapsedTime();
      const { timeOfDay: tod, bgCardRole: role } = stateRef.current;
      const isNight = tod === 'night';

      // ── Moon arc: rises from left, arcs across top ─────────
      {
        // Slow arc: ~4 min per full cycle visible
        const moonT  = t * 0.025;
        const arcR   = 20;
        // Arc: x goes -arcR to +arcR, y follows a parabola
        const nx = Math.sin(moonT) * arcR;                    // left-to-right
        const ny = Math.abs(Math.cos(moonT * 0.5)) * 12 + 6; // arc height
        moon.position.set(nx, ny, -24);
        moonLight.position.copy(moon.position);
        moon.visible      = isNight;
        moonLight.visible = isNight;

        // Pulse glow
        const pulse = 0.5 + 0.15 * Math.sin(t * 0.4);
        moonMat.emissiveIntensity = pulse;
        (moonGlow1.material as THREE.MeshBasicMaterial).opacity = 0.1 + 0.06 * Math.sin(t * 0.3);
        (moonGlow2.material as THREE.MeshBasicMaterial).opacity = 0.04 + 0.03 * Math.sin(t * 0.25);
        moonLight.intensity = 4 + 1.5 * Math.sin(t * 0.35);
      }

      // ── Sun arc (opposite phase, daytime) ─────────────────
      {
        const sunT = t * 0.022 + Math.PI * 0.7;
        const arcR = 22;
        const nx = Math.sin(sunT) * arcR;
        const ny = Math.abs(Math.cos(sunT * 0.45)) * 14 + 6;
        sun.position.set(nx, ny, -24);
        sunLight.position.copy(sun.position);
        sun.visible      = !isNight;
        sunLight.visible = !isNight;

        // Pulse sun
        const sunPulse = 1.1 + 0.25 * Math.sin(t * 0.7);
        sunMat.emissiveIntensity = sunPulse;
        (sunGlow1.material as THREE.MeshBasicMaterial).opacity = 0.15 + 0.08 * Math.sin(t * 0.6);
        (sunGlow2.material as THREE.MeshBasicMaterial).opacity = 0.06 + 0.04 * Math.sin(t * 0.5);
        sunLight.intensity = 4.5 + 1.5 * Math.sin(t * 0.8);

        // Spinning corona rings
        coronaRings.forEach((ring, i) => {
          ring.rotation.z = t * (0.25 + i * 0.08);
          ring.rotation.x = t * (0.1  + i * 0.05);
        });
      }

      // ── Background colour shift night ↔ day ──────────────
      // Gentle: keep dark base but warm up slightly in day
      if (isNight) {
        renderer.setClearColor(0x0a0608, 1);
        hemi.color.set(0x1a0a20);
      } else {
        renderer.setClearColor(0x0f0810, 1);
        hemi.color.set(0x251520);
      }

      // ── Stars fade day/night ──────────────────────────────
      const starTarget = isNight ? 0.85 : 0.08;
      starMat.opacity += (starTarget - starMat.opacity) * 0.015;

      // ── Fog sway ─────────────────────────────────────────
      const fp = fogGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < FOG; i++) {
        fp[i*3+1] += Math.sin(t * 0.6 + fogPh[i]) * 0.003;
        fp[i*3]   += Math.cos(t * 0.4 + fogPh[i]) * 0.002;
      }
      fogGeo.attributes.position.needsUpdate = true;
      fogMat.color.set(isNight ? 0xc9a84c : 0xffe0a0);
      fogMat.opacity = 0.22 + 0.1 * Math.sin(t * 0.5);

      // ── Torus knot ────────────────────────────────────────
      torusKnot.rotation.x = t * 0.18;
      torusKnot.rotation.y = t * 0.12;
      torusKnot.visible = isNight;

      // ── Background card ───────────────────────────────────
      if (role !== currentCardRole) loadCard(role ?? null);

      // Animate card opacity
      const oDiff = cardOpacityTarget - cardMat.opacity;
      if (Math.abs(oDiff) > 0.001) {
        cardMat.opacity  += oDiff * 0.045;
        frameMat.opacity  = cardMat.opacity * 0.6;
      }

      // Slow float
      cardMesh.position.y  = -5 + Math.sin(t * 0.22) * 0.7;
      frameMesh.position.y = cardMesh.position.y;
      cardMesh.rotation.z  = -0.12 + Math.sin(t * 0.15) * 0.018;
      frameMesh.rotation.z = cardMesh.rotation.z;

      // ── Stars slow drift ──────────────────────────────────
      stars.rotation.y = t * 0.005;

      // ── Camera mouse parallax ─────────────────────────────
      camera.rotation.x += (-my * 0.03 - camera.rotation.x) * 0.04;
      camera.rotation.y += ( mx * 0.03 - camera.rotation.y) * 0.04;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      renderer.dispose();
    };
  }, []);

  return canvasRef;
}
