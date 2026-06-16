"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { SpaceCanvas, SpaceCanvasRef } from "./SpaceCanvas";
import { ProblemCard } from "./ProblemCard";
import { Dashboard } from "./Dashboard";
import { ArrowRight, Rocket } from "lucide-react";

export const LaunchExperience: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Layout refs
  const spaceCanvasRef = useRef<SpaceCanvasRef>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const orbitContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // Dual-orbit refs
  const primaryStarRef = useRef<HTMLDivElement>(null);
  const secondaryStarRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const primaryAngleRef = useRef(0);
  const secondaryAngleRef = useRef(Math.PI);
  const isOrbitingRef = useRef(true);
  const primaryCoordsRef = useRef({ x: 0, y: 0 });
  const secondaryCoordsRef = useRef({ x: 0, y: 0 });

  // ═══════════════════════════════════════════════════════════
  // 1. DUAL-ORBIT SYSTEM — starts immediately on mount
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (isTransitioning) return;

    isOrbitingRef.current = true;
    let cancelled = false;
    let frameCount = 0;

    const spawnTrail = (x: number, y: number, type: "primary" | "secondary") => {
      if (!orbitContainerRef.current) return;

      const trail = document.createElement("div");
      const isPrimary = type === "primary";

      Object.assign(trail.style, {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: isPrimary ? "8px" : "5px",
        height: isPrimary ? "8px" : "5px",
        borderRadius: "50%",
        background: isPrimary ? "#ff6a00" : "#ff8833",
        boxShadow: isPrimary
          ? "0 0 6px #ff6a00, 0 0 14px rgba(255,106,0,0.35)"
          : "0 0 4px #ff8833, 0 0 10px rgba(255,136,51,0.25)",
        opacity: isPrimary ? "0.6" : "0.35",
        pointerEvents: "none",
        zIndex: "20",
        transform: "translate(-50%, -50%)",
        transition: "all 400ms ease-out",
      });

      orbitContainerRef.current.appendChild(trail);

      requestAnimationFrame(() => {
        trail.style.transform = "translate(-50%, -50%) scale(0.05)";
        trail.style.opacity = "0";
        setTimeout(() => trail.remove(), 420);
      });
    };

    const runDualOrbit = () => {
      if (cancelled || !isOrbitingRef.current) return;
      if (
        !primaryStarRef.current ||
        !secondaryStarRef.current ||
        !titleRef.current ||
        !orbitContainerRef.current
      )  {
        requestAnimationFrame(runDualOrbit);
        return;
      }

      const titleRect = titleRef.current.getBoundingClientRect();
      const containerRect = orbitContainerRef.current.getBoundingClientRect();

      const centerX = titleRect.left - containerRect.left + titleRect.width / 2;
      const centerY = titleRect.top - containerRect.top + titleRect.height / 2;

      // Large elegant elliptical orbit around BHARATAQI
      const radiusX = titleRect.width / 2 + 70;
      const radiusY = titleRect.height / 2 + 35;

      // Primary: clockwise (~7s revolution at 60fps)
      primaryAngleRef.current += 0.0145;
      const px = centerX + radiusX * Math.cos(primaryAngleRef.current);
      const py = centerY + radiusY * Math.sin(primaryAngleRef.current);
      primaryCoordsRef.current = { x: px, y: py };

      primaryStarRef.current.style.left = `${px}px`;
      primaryStarRef.current.style.top = `${py}px`;
      primaryStarRef.current.style.opacity = "1";

      // Secondary: counter-clockwise
      secondaryAngleRef.current -= 0.0145;
      const sx = centerX + radiusX * Math.cos(secondaryAngleRef.current);
      const sy = centerY + radiusY * Math.sin(secondaryAngleRef.current);
      secondaryCoordsRef.current = { x: sx, y: sy };

      secondaryStarRef.current.style.left = `${sx}px`;
      secondaryStarRef.current.style.top = `${sy}px`;
      secondaryStarRef.current.style.opacity = "1";

      // Trail particles every 2nd frame
      frameCount++;
      if (frameCount % 2 === 0) {
        spawnTrail(px, py, "primary");
        spawnTrail(sx, sy, "secondary");
      }

      requestAnimationFrame(runDualOrbit);
    };

    // Small delay to let refs mount
    const raf = requestAnimationFrame(runDualOrbit);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [isTransitioning]);

  // ═══════════════════════════════════════════════════════════
  // 2. DOCKING SEQUENCE — Stars converge → merge → pulse → dashboard
  // ═══════════════════════════════════════════════════════════
  const handleEnterPlatform = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    isOrbitingRef.current = false;

    const pX = primaryCoordsRef.current.x;
    const pY = primaryCoordsRef.current.y;
    const sX = secondaryCoordsRef.current.x;
    const sY = secondaryCoordsRef.current.y;

    if (
      !dotRef.current ||
      !orbitContainerRef.current ||
      !primaryStarRef.current ||
      !secondaryStarRef.current
    ) {
      transitionToDashboard();
      return;
    }

    const dotRect = dotRef.current.getBoundingClientRect();
    const containerRect = orbitContainerRef.current.getBoundingClientRect();
    const targetX = dotRect.left - containerRect.left + dotRect.width / 2;
    const targetY = dotRect.top - containerRect.top + dotRect.height / 2;

    const primaryCoords = { x: pX, y: pY };
    const secondaryCoords = { x: sX, y: sY };

    const dockTl = gsap.timeline();

    // Stars converge on the AQI dot
    dockTl
      .to(primaryCoords, {
        x: targetX, y: targetY, duration: 0.8, ease: "power3.inOut",
        onUpdate: () => {
          if (!primaryStarRef.current || !orbitContainerRef.current) return;
          primaryStarRef.current.style.left = `${primaryCoords.x}px`;
          primaryStarRef.current.style.top = `${primaryCoords.y}px`;
          spawnDockTrail(primaryCoords.x, primaryCoords.y, "primary");
        },
      }, 0)
      .to(secondaryCoords, {
        x: targetX, y: targetY, duration: 0.8, ease: "power3.inOut",
        onUpdate: () => {
          if (!secondaryStarRef.current || !orbitContainerRef.current) return;
          secondaryStarRef.current.style.left = `${secondaryCoords.x}px`;
          secondaryStarRef.current.style.top = `${secondaryCoords.y}px`;
          spawnDockTrail(secondaryCoords.x, secondaryCoords.y, "secondary");
        },
      }, 0);

    // Hide stars at merge point
    dockTl.add(() => {
      if (primaryStarRef.current) primaryStarRef.current.style.opacity = "0";
      if (secondaryStarRef.current) secondaryStarRef.current.style.opacity = "0";
    }, 0.75);

    // Dot super-glow
    dockTl
      .to(dotRef.current, {
        scale: 2.5, backgroundColor: "#ffffff",
        boxShadow: "0 0 40px #ff6a00, 0 0 80px #ff6a00, 0 0 120px rgba(255,106,0,0.4)",
        duration: 0.25, ease: "power2.out",
      }, 0.8)
      .to(dotRef.current, {
        scale: 1, backgroundColor: "#ff6a00", boxShadow: "0 0 8px #ff6a00",
        duration: 0.4, ease: "power2.inOut",
      }, 1.05);

    // Energy pulse ring
    dockTl.add(() => {
      if (!orbitContainerRef.current) return;
      const wave = document.createElement("div");
      Object.assign(wave.style, {
        position: "absolute", left: `${targetX}px`, top: `${targetY}px`,
        width: "12px", height: "12px", borderRadius: "50%",
        border: "2px solid #ff6a00",
        boxShadow: "0 0 15px #ff6a00, 0 0 30px rgba(255,106,0,0.3)",
        pointerEvents: "none", zIndex: "30",
        transform: "translate(-50%,-50%) scale(1)",
      });
      orbitContainerRef.current.appendChild(wave);
      gsap.to(wave, { scale: 20, opacity: 0, duration: 0.75, ease: "power2.out", onComplete: () => wave.remove() });
    }, 0.85);

    // Dashboard transition
    dockTl.add(() => transitionToDashboard(), 1.2);
  };

  const spawnDockTrail = (x: number, y: number, type: "primary" | "secondary") => {
    if (!orbitContainerRef.current) return;
    const isPrimary = type === "primary";
    const trail = document.createElement("div");
    Object.assign(trail.style, {
      position: "absolute", left: `${x}px`, top: `${y}px`,
      width: isPrimary ? "8px" : "5px", height: isPrimary ? "8px" : "5px",
      borderRadius: "50%", background: isPrimary ? "#ff6a00" : "#ff8833",
      boxShadow: isPrimary ? "0 0 8px #ff6a00, 0 0 16px #ff6a0066" : "0 0 5px #ff8833",
      opacity: isPrimary ? "0.8" : "0.5", pointerEvents: "none", zIndex: "20",
      transform: "translate(-50%,-50%)", transition: "all 300ms ease-out",
    });
    orbitContainerRef.current.appendChild(trail);
    requestAnimationFrame(() => {
      trail.style.transform = "translate(-50%,-50%) scale(0.1)";
      trail.style.opacity = "0";
      setTimeout(() => trail.remove(), 320);
    });
  };

  // ═══════════════════════════════════════════════════════════
  // 3. DASHBOARD TRANSITION — zoom-blur exit
  // ═══════════════════════════════════════════════════════════
  const transitionToDashboard = () => {
    spaceCanvasRef.current?.setRocketState("ascending", 0.5, 0.1);

    gsap.to(heroRef.current, {
      opacity: 0, scale: 1.12, filter: "blur(14px)",
      duration: 1.0, ease: "power2.inOut",
      onComplete: () => setShowDashboard(true),
    });
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <div
      ref={pageRef}
      className="relative w-full min-h-screen bg-[#03050a] text-white flex flex-col items-center overflow-hidden select-none"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none select-none z-0"
        style={{ backgroundImage: "url('/assets/background.png')", transform: "scale(1.05)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03050a] via-transparent to-[#03050a]/90 pointer-events-none z-0" />

      {/* Three.js ambient starfield */}
      <SpaceCanvas ref={spaceCanvasRef} />

      {/* ── TOP NAV ── */}
      <nav className="relative z-40 w-full flex items-center justify-between px-6 md:px-10 pt-6">
        {/* Telemetry badge */}
        <div className="font-mono text-[10px] text-white/35 tracking-[0.2em] uppercase flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)] animate-pulse" />
          SYSTEMS ONLINE — SAT_STREAM: FUSED
        </div>

        {/* Launch Platform CTA */}
        <button
          onClick={handleEnterPlatform}
          disabled={isTransitioning}
          className="px-5 py-2.5 text-xs font-orbitron font-bold tracking-widest text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange/50 rounded-full flex items-center gap-2 transition-all duration-300 backdrop-blur-md group disabled:opacity-50"
        >
          <Rocket className="w-3.5 h-3.5 text-orange group-hover:translate-x-0.5 transition-transform duration-300" />
          LAUNCH PLATFORM
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </nav>

      {/* ── HERO SECTION ── */}
      <div
        ref={heroRef}
        className="relative z-20 flex-1 w-full max-w-4xl px-6 flex flex-col items-center justify-center"
        style={{ marginTop: "-2vh" }}
      >
        {/* ISRO LOGO */}
        <motion.img
          src="/assets/isro-wordmark.png"
          alt="ISRO Logo"
          className="w-28 md:w-36 object-contain glow-blue"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* WELCOME TO / BHARATAQI — orbit container */}
        <div
          ref={orbitContainerRef}
          className="relative flex flex-col items-center text-center mt-7 md:mt-9 overflow-visible"
          style={{ padding: "40px 80px" }}
        >
          {/* PRIMARY orbiting star */}
          <div
            ref={primaryStarRef}
            className="absolute pointer-events-none z-30 opacity-0"
            style={{
              width: "11px",
              height: "11px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #fff 0%, #ffaa33 45%, #ff6a00 100%)",
              boxShadow: "0 0 10px #ff6a00, 0 0 20px #ff6a00, 0 0 35px #ffd15c",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* SECONDARY orbiting star */}
          <div
            ref={secondaryStarRef}
            className="absolute pointer-events-none z-30 opacity-0"
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #fff 0%, #ffcc66 45%, #ff8833 100%)",
              boxShadow: "0 0 6px #ff8833, 0 0 14px rgba(255,136,51,0.45)",
              transform: "translate(-50%, -50%)",
            }}
          />

          <motion.div
            ref={titleRef}
            className="flex flex-col items-center relative"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          >
            <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/45 uppercase pl-[0.4em] mb-1.5">
              WELCOME TO
            </span>
            <h1 className="font-orbitron font-black text-4xl md:text-5xl lg:text-6xl tracking-[0.15em] text-white pl-[0.15em] relative">
              <span>BHARAT</span>
              <span className="text-orange glow-text-orange relative">
                AQI
                <span
                  ref={dotRef}
                  className="inline-block w-2.5 h-2.5 rounded-full bg-orange ml-1.5 relative bottom-0.5 shadow-[0_0_8px_#ff6a00] transition-all duration-300"
                />
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="font-display text-white/70 text-xs md:text-sm tracking-wide mt-3 md:mt-4"
          >
            Satellite-Powered Air Quality Intelligence for India
          </motion.p>
        </div>

        {/* PROBLEM STATEMENT CARD */}
        <motion.div
          className="w-full flex justify-center mt-8 md:mt-10"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
        >
          <ProblemCard />
        </motion.div>

        {/* CTA BUTTONS */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 mt-8 md:mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
        >
          <button
            onClick={handleEnterPlatform}
            disabled={isTransitioning}
            className="px-7 py-3.5 bg-gradient-to-r from-orange to-orange-flame text-white font-orbitron font-bold text-xs tracking-widest rounded-full shadow-[0_0_15px_rgba(255,106,0,0.35)] hover:shadow-[0_0_30px_rgba(255,106,0,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-2.5 border border-orange-core/50 group disabled:opacity-50"
          >
            ENTER MISSION CONTROL
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>

          <button
            onClick={handleEnterPlatform}
            disabled={isTransitioning}
            className="px-7 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-white/75 hover:text-white font-orbitron font-bold text-xs tracking-widest rounded-full border border-white/10 hover:border-orange/40 transition-all duration-300 disabled:opacity-50"
          >
            EXPLORE AQI DATA
          </button>
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-8 md:h-12" />
      </div>
    </div>
  );
};
