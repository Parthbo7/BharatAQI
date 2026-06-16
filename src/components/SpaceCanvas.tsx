"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";

export interface SpaceCanvasRef {
  setRocketState: (
    state: "idle" | "igniting" | "launching" | "ascending" | "reveal" | "done",
    screenX?: number,
    screenY?: number
  ) => void;
  triggerBeacon: (screenX: number, screenY: number) => void;
}

export interface SpaceCanvasProps {
  className?: string;
}

export const SpaceCanvas = forwardRef<SpaceCanvasRef, SpaceCanvasProps>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References to animation variables
  const stateRef = useRef<{
    state: "idle" | "igniting" | "launching" | "ascending" | "reveal" | "done";
    rocketX: number;
    rocketY: number;
    speedMultiplier: number;
    beaconActive: boolean;
  }>({
    state: "idle",
    rocketX: 0.5,
    rocketY: 0.5,
    speedMultiplier: 1.0,
    beaconActive: false,
  });

  // Particle systems
  const flameParticles = useRef<{
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    color: THREE.Color;
    size: number;
    life: number;
    maxLife: number;
  }[]>([]);

  // Expose controls to the parent component
  useImperativeHandle(ref, () => ({
    setRocketState(state, screenX?, screenY?) {
      stateRef.current.state = state;
      if (screenX !== undefined) stateRef.current.rocketX = screenX;
      if (screenY !== undefined) stateRef.current.rocketY = screenY;

      if (state === "ascending") {
        stateRef.current.speedMultiplier = 15.0;
      } else if (state === "reveal" || state === "done") {
        stateRef.current.speedMultiplier = 0.5;
        stateRef.current.beaconActive = true;
      } else {
        stateRef.current.speedMultiplier = 1.0;
      }
    },
    triggerBeacon(screenX, screenY) {
      stateRef.current.state = "reveal";
      stateRef.current.rocketX = screenX;
      stateRef.current.rocketY = screenY;
      stateRef.current.beaconActive = true;
    },
  }));

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // 1. Setup Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Add Ambient Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffaa44, 2, 50);
    scene.add(pointLight);

    // Secondary beacon glow light (gentle pulsing)
    const beaconLight = new THREE.PointLight(0xffcc66, 0, 30);
    scene.add(beaconLight);

    // 3. Create Twinkling Starfield (Thousands of tiny stars)
    const starCount = 1500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starTwinkles = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 40;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      starPositions[i * 3 + 2] = -Math.random() * 20 - 5;

      const rand = Math.random();
      if (rand < 0.75) {
        starColors[i * 3] = 0.9;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 1.0;
      } else if (rand < 0.9) {
        starColors[i * 3] = 0.45;
        starColors[i * 3 + 1] = 0.75;
        starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.6;
        starColors[i * 3 + 2] = 0.3;
      }

      starSizes[i] = 0.05 + Math.random() * 0.15;
      starTwinkles[i] = Math.random() * Math.PI * 2;
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    // Star texture
    const createStarTexture = () => {
      const c = document.createElement("canvas");
      c.width = 16;
      c.height = 16;
      const ctx = c.getContext("2d")!;
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
      return new THREE.CanvasTexture(c);
    };

    const starMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      map: createStarTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 4. Create Dynamic Sparks / Rocket Flame Engine Overlay
    const particleGeometry = new THREE.BufferGeometry();
    const maxParticles = 800;

    const createParticleTexture = () => {
      const c = document.createElement("canvas");
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext("2d")!;
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(255, 180, 50, 0.9)");
      grad.addColorStop(0.5, "rgba(255, 80, 0, 0.6)");
      grad.addColorStop(0.8, "rgba(80, 80, 80, 0.2)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(c);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      map: createParticleTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const activeParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(activeParticles);

    // 5. Earth Horizon Atmospheric Glow (Bottom of Screen)
    const earthGeometry = new THREE.BufferGeometry();
    const curvePoints = [];
    const segments = 60;
    for (let i = 0; i <= segments; i++) {
      const pct = i / segments;
      const angle = Math.PI + (pct - 0.5) * 0.6;
      const r = 25;
      const cx = 0;
      const cy = -29;
      curvePoints.push(new THREE.Vector3(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, -2));
    }
    const earthCurve = new THREE.CatmullRomCurve3(curvePoints);
    const earthTubeGeometry = new THREE.TubeGeometry(earthCurve, segments, 0.4, 8, false);
    const earthMaterial = new THREE.MeshBasicMaterial({
      color: 0x1d4ed8,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const earthHorizon = new THREE.Mesh(earthTubeGeometry, earthMaterial);
    scene.add(earthHorizon);

    const horizonGlowGeo = new THREE.TubeGeometry(earthCurve, segments, 0.1, 8, false);
    const horizonGlowMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const horizonGlow = new THREE.Mesh(horizonGlowGeo, horizonGlowMat);
    scene.add(horizonGlow);

    // Mouse movement parallax effect
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // 6. Main Render Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const tick = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const { state, rocketX, rocketY, speedMultiplier, beaconActive } = stateRef.current;

      // Parallax lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      camera.position.x = currentMouseX;
      camera.position.y = currentMouseY;
      camera.lookAt(0, 0, 0);

      // Starfield Twinkling & Motion
      const positions = starGeometry.attributes.position.array as Float32Array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        starTwinkles[i] += delta * 2;
        
        const fallSpeed = 0.5 * speedMultiplier * delta;
        positions[i * 3 + 1] -= fallSpeed;

        if (positions[i * 3 + 1] < -20) {
          positions[i * 3 + 1] = 20;
          positions[i * 3] = (Math.random() - 0.5) * 40;
        }

        positions[i * 3] += Math.sin(elapsed + starTwinkles[i]) * 0.001;
      }
      starGeometry.attributes.position.needsUpdate = true;

      // Rotate camera / scene slowly for kinetic space feel
      scene.rotation.z = elapsed * 0.008;

      // Adjust star field material size based on speed
      if (state === "ascending") {
        starMaterial.size = 0.28;
      } else {
        starMaterial.size = 0.12 + Math.sin(elapsed * 2) * 0.02;
      }

      // Map SVG Rocket Screen Space Coordinates to Three.js Space
      const aspect = width / height;
      const rX = (rocketX * 2 - 1) * 10 * aspect;
      const rY = -(rocketY * 2 - 1) * 10;
      const rZ = 0.2;

      pointLight.position.set(rX, rY, rZ + 0.5);

      // Rocket flame / sparks emitter logic
      if (state === "igniting" || state === "launching" || state === "ascending") {
        pointLight.intensity = state === "igniting" ? 2 + Math.random() * 5 : 8 + Math.random() * 10;
        pointLight.color.setHex(state === "igniting" ? 0xff6a00 : 0xffaa33);

        const particleCountToSpawn = state === "igniting" ? 2 : state === "ascending" ? 4 : 8;

        for (let i = 0; i < particleCountToSpawn; i++) {
          const spreadX = state === "igniting" ? 0.08 : 0.25;
          const spreadZ = state === "igniting" ? 0.08 : 0.25;
          
          const pos = new THREE.Vector3(
            rX + (Math.random() - 0.5) * spreadX,
            rY - 0.2,
            rZ + (Math.random() - 0.5) * spreadZ
          );

          const speedY = state === "igniting" ? 1.0 + Math.random() * 2 : 4.0 + Math.random() * 7;
          const spreadVelX = state === "igniting" ? 0.3 : 1.2;
          const vel = new THREE.Vector3(
            (Math.random() - 0.5) * spreadVelX,
            -speedY,
            (Math.random() - 0.5) * 0.5
          );

          const isSmoke = Math.random() > 0.4 && state !== "igniting";
          const color = isSmoke
            ? new THREE.Color(0x374151).lerp(new THREE.Color(0x6b7280), Math.random())
            : new THREE.Color(0xff6a00).lerp(new THREE.Color(0xffd15c), Math.random());

          flameParticles.current.push({
            pos,
            vel,
            color,
            size: isSmoke ? 0.35 + Math.random() * 0.4 : 0.15 + Math.random() * 0.25,
            life: 1.0,
            maxLife: isSmoke ? 1.2 + Math.random() * 0.8 : 0.3 + Math.random() * 0.4,
          });
        }
      } else if (state === "reveal" || state === "done") {
        // Gentle beacon glow — warm orange pulsing light, no explosions
        pointLight.color.setHex(0xffaa44);
        pointLight.position.set(rX, rY, rZ + 0.5);
        // Gentle breathing intensity: base 3.5 with a sine oscillation of ±1.5
        pointLight.intensity = 3.5 + Math.sin(elapsed * 3) * 1.5;

        // Secondary beacon light pulses in counter-phase for depth
        if (beaconActive) {
          beaconLight.position.set(rX, rY + 0.3, rZ + 1.0);
          beaconLight.intensity = 2.0 + Math.sin(elapsed * 4 + 1.5) * 1.0;
          beaconLight.color.setHex(0xffcc88);
        }
      } else {
        pointLight.intensity = Math.max(0, pointLight.intensity - delta * 5);
      }

      // Update & Draw dynamic particles (flame trail only, no explosions)
      const pPositions = new Float32Array(maxParticles * 3);
      const pColors = new Float32Array(maxParticles * 3);
      const pSizes = new Float32Array(maxParticles);

      let pIdx = 0;
      flameParticles.current = flameParticles.current.filter((p) => {
        p.life -= delta / p.maxLife;

        if (p.life <= 0) return false;

        p.pos.addScaledVector(p.vel, delta);
        
        // Subtle wind resistance / float
        p.vel.x += Math.sin(elapsed * 10 + p.life) * 0.05;
        if (p.color.r === p.color.g && p.color.g === p.color.b) {
          p.vel.y += delta * 1.2;
          p.size += delta * 0.6;
        }

        if (pIdx < maxParticles) {
          pPositions[pIdx * 3] = p.pos.x;
          pPositions[pIdx * 3 + 1] = p.pos.y;
          pPositions[pIdx * 3 + 2] = p.pos.z;

          pColors[pIdx * 3] = p.color.r * p.life;
          pColors[pIdx * 3 + 1] = p.color.g * p.life;
          pColors[pIdx * 3 + 2] = p.color.b * p.life;

          pSizes[pIdx] = p.size * p.life;

          pIdx++;
        }
        return true;
      });

      particleGeometry.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
      particleGeometry.setAttribute("color", new THREE.BufferAttribute(pColors, 3));
      particleGeometry.setAttribute("size", new THREE.BufferAttribute(pSizes, 1));
      particleGeometry.setDrawRange(0, pIdx);

      // Render
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (renderer) renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
    >
      <canvas ref={canvasRef} className="block w-full h-full bg-transparent" />
    </div>
  );
});

SpaceCanvas.displayName = "SpaceCanvas";
