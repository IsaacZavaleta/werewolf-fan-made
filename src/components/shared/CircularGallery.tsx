import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import cardImages from '../../data/cardImages';

interface Props {
  /** radius of the ring */
  radius?: number;
  /** how far back the ring sits */
  depth?: number;
  /** card width in world units */
  cardW?: number;
  /** card height in world units */
  cardH?: number;
  /** rotation speed rad/s */
  speed?: number;
  /** overall opacity */
  opacity?: number;
  style?: React.CSSProperties;
}

const ROLE_IDS = [
  'lobo','vidente','bruja','cazador','cupido','protector',
  'ninia','angel','zorro','caballero','aldeano','juez',
  'nino','sectario','gemelas','anciano','albino','padre',
  'perrolobo','gitana','feroz',
];

export function CircularGallery({
  radius = 18,
  depth  = -30,
  cardW  = 5.2,
  cardH  = 7.5,
  speed  = 0.18,
  opacity = 0.55,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
    camera.position.set(0, 0, 0);

    // ── Load all card textures ─────────────────────────────────
    const loader  = new THREE.TextureLoader();
    const cards: THREE.Mesh[] = [];
    const count   = ROLE_IDS.length;

    ROLE_IDS.forEach((id, i) => {
      const angle  = (i / count) * Math.PI * 2;
      const x      = Math.sin(angle) * radius;
      const z      = Math.cos(angle) * radius + depth;
      const geo    = new THREE.PlaneGeometry(cardW, cardH, 1, 1);

      // Card frame material (gold border effect via slight scale)
      const frameMat = new THREE.MeshBasicMaterial({
        color: 0xc9a84c, transparent: true, opacity: opacity * 0.4, side: THREE.DoubleSide,
      });
      const frame = new THREE.Mesh(
        new THREE.PlaneGeometry(cardW + 0.15, cardH + 0.15),
        frameMat,
      );

      const imgSrc = (cardImages as Record<string, string>)[id];
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, 0, z);
      mesh.lookAt(0, 0, depth + radius * 0.3); // face inward
      frame.position.set(x, 0, z - 0.01);
      frame.lookAt(0, 0, depth + radius * 0.3);

      if (imgSrc) {
        loader.load(imgSrc, (tex) => {
          tex.minFilter = THREE.LinearFilter;
          mat.map     = tex;
          mat.opacity = opacity;
          mat.needsUpdate = true;
          frameMat.opacity = opacity * 0.5;
        });
      } else {
        mat.color.set(0x1a0a10);
        mat.opacity = opacity * 0.6;
      }

      scene.add(mesh);
      scene.add(frame);
      cards.push(mesh);
      (mesh as any).__frameRef = frame;
      (mesh as any).__baseAngle = angle;
    });

    // ── Mouse parallax ────────────────────────────────────────
    let mx = 0, my = 0;
    function onMouse(e: MouseEvent) {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', onMouse);

    // ── Resize ────────────────────────────────────────────────
    function resize() {
      if(!canvas) return;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ── Animate ───────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId  = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const rot = t * speed;

      cards.forEach((mesh, i) => {
        const base  = (mesh as any).__baseAngle as number;
        const angle = base + rot;
        const x     = Math.sin(angle) * radius;
        const z     = Math.cos(angle) * radius + depth;

        mesh.position.set(x, Math.sin(t * 0.4 + i * 0.5) * 0.3, z);
        mesh.lookAt(0, 0, depth + radius * 0.3);

        const frame = (mesh as any).__frameRef as THREE.Mesh;
        if (frame) {
          frame.position.set(x, mesh.position.y, z - 0.01);
          frame.lookAt(0, 0, depth + radius * 0.3);
        }

        // Pulse cards near front (facing camera)
        const frontness = Math.cos(angle); // 1 = front, -1 = back
        const scaleFactor = 0.85 + 0.3 * Math.max(0, frontness);
        mesh.scale.setScalar(scaleFactor);
        if (frame) frame.scale.setScalar(scaleFactor);

        // Fade back cards
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = opacity * (0.3 + 0.7 * Math.max(0, frontness));
      });

      // Subtle camera drift from mouse
      camera.position.x += (mx * 1.5 - camera.position.x) * 0.03;
      camera.position.y += (-my * 0.8 - camera.position.y) * 0.03;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      ro.disconnect();
      renderer.dispose();
    };
  }, [radius, depth, cardW, cardH, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%', height: '100%',
        display: 'block',
        ...style,
      }}
    />
  );
}
