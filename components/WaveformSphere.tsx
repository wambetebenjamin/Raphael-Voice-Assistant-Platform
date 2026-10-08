"use client";

import { useEffect, useRef } from "react";
import { audioLevel } from "@lib/voice/audio-bus";
import { useReducedMotion, useTabVisible } from "@lib/voice/useReducedMotion";

/**
 * EFFECT-01 — WebGL (Three.js) audio waveform sphere.
 * Vertices pulse outward with live microphone level; with the mic off it
 * rotates slowly. Draggable to orbit; arrow keys orbit for keyboard users.
 * Never initialised under prefers-reduced-motion (poster frame instead) and
 * paused whenever the tab is hidden. Loaded via dynamic import so it never
 * delays LCP.
 */
export default function WaveformSphere({ active }: { active: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const reduced = useReducedMotion();
  const visible = useTabVisible();
  const visibleRef = useRef(visible);

  useEffect(() => {
    activeRef.current = active;
    visibleRef.current = visible;
  }, [active, visible]);

  useEffect(() => {
    if (reduced) return;
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let raf = 0;
    let cleanup: () => void = () => undefined;

    const boot = async () => {
      const THREE = await import("three");
      if (disposed || !mount.isConnected) return;

      const width = mount.clientWidth || 600;
      const height = mount.clientHeight || 400;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
      camera.position.set(0, 0, 4.4);

      const geometry = new THREE.SphereGeometry(1.35, 56, 56);
      const basePositions = Float32Array.from(geometry.attributes.position.array);
      const material = new THREE.MeshBasicMaterial({
        color: 0x0aa8a7,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(1.05, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x084e4d, transparent: true, opacity: 0.16 })
      );
      scene.add(glow);

      // orbit by drag
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      let velX = 0.0022;
      let velY = 0.0011;
      const onDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        velX = (e.clientX - lastX) * 0.00045;
        velY = (e.clientY - lastY) * 0.00045;
        sphere.rotation.y += velX;
        sphere.rotation.x += velY;
        glow.rotation.copy(sphere.rotation);
        lastX = e.clientX;
        lastY = e.clientY;
      };
      const onUp = () => {
        dragging = false;
      };
      const onKey = (e: KeyboardEvent) => {
        const step = 0.12;
        if (e.key === "ArrowLeft") sphere.rotation.y -= step;
        else if (e.key === "ArrowRight") sphere.rotation.y += step;
        else if (e.key === "ArrowUp") sphere.rotation.x -= step;
        else if (e.key === "ArrowDown") sphere.rotation.x += step;
        else return;
        e.preventDefault();
        glow.rotation.copy(sphere.rotation);
      };
      mount.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      mount.addEventListener("keydown", onKey);

      const onResize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      const positions = geometry.attributes.position;
      const clock = new THREE.Clock();

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!visibleRef.current) return; // paused when tab hidden
        const t = clock.getElapsedTime();
        const level = activeRef.current ? audioLevel() : 0;

        if (!dragging) {
          sphere.rotation.y += activeRef.current ? 0.0035 : 0.0022;
          sphere.rotation.x += 0.0006;
          glow.rotation.copy(sphere.rotation);
        }

        for (let i = 0; i < positions.count; i += 1) {
          const ix = i * 3;
          const x = basePositions[ix];
          const y = basePositions[ix + 1];
          const z = basePositions[ix + 2];
          const wave =
            Math.sin(x * 3.1 + t * 2.2) * Math.cos(y * 2.7 + t * 1.7) * Math.sin(z * 2.3 + t * 1.3);
          const push = 1 + level * 0.42 * (0.55 + wave) + (activeRef.current ? 0.02 : 0);
          positions.array[ix] = x * push;
          positions.array[ix + 1] = y * push;
          positions.array[ix + 2] = z * push;
        }
        positions.needsUpdate = true;
        material.opacity = 0.45 + level * 0.4;
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(raf);
        mount.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        mount.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
        geometry.dispose();
        material.dispose();
        glow.geometry.dispose();
        glow.material.dispose();
        renderer.dispose();
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      };
    };

    void boot();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [reduced]);

  return (
    <div
      ref={mountRef}
      className="sphere-stage"
      role="img"
      aria-label="A three dimensional audio waveform sphere. It pulses when the microphone hears you and can be rotated by dragging or with the arrow keys."
      tabIndex={0}
    >
      {reduced ? (
        <div className="sphere-poster">
          {/* poster fallback under reduced motion */}
          <svg viewBox="0 0 220 220" className="h-[240px] w-[240px]" aria-hidden="true">
            <circle cx="110" cy="110" r="86" fill="none" stroke="#0aa8a7" strokeWidth="1.4" opacity="0.75" />
            <circle cx="110" cy="110" r="64" fill="none" stroke="#0b6e6d" strokeWidth="1.1" opacity="0.6" />
            <circle cx="110" cy="110" r="42" fill="#edf6f5" stroke="#084e4d" strokeWidth="1.1" />
            {[...Array(12)].map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const r1 = 86;
              const r2 = 96 + (i % 3) * 8;
              return (
                <line
                  key={i}
                  x1={110 + Math.cos(a) * r1}
                  y1={110 + Math.sin(a) * r1}
                  x2={110 + Math.cos(a) * r2}
                  y2={110 + Math.sin(a) * r2}
                  stroke="#0aa8a7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>
      ) : null}
    </div>
  );
}
