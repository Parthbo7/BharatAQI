"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Map, ShieldAlert, Flame, Compass, Cpu } from "lucide-react";

interface ProblemCardProps {
  className?: string;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ className = "" }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const objectives = [
    {
      title: "Surface AQI Mapping",
      desc: "High-resolution continuous spatial mapping across India",
      icon: Map,
      color: "text-blue-light",
    },
    {
      title: "HCHO Hotspot Detection",
      desc: "Pinpointing formaldehyde anomalies and gas emissions",
      icon: ShieldAlert,
      color: "text-orange",
    },
    {
      title: "Biomass Burning Analysis",
      desc: "Real-time tracking of active agricultural fires",
      icon: Flame,
      color: "text-orange-flame",
    },
    {
      title: "Environmental Decision Support",
      desc: "Actionable datasets for policy makers and researchers",
      icon: Compass,
      color: "text-emerald-400",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`
        w-full max-w-3xl
        px-7 py-6 md:px-9 md:py-8
        rounded-2xl
        relative overflow-hidden
        backdrop-blur-2xl
        bg-white/[0.03]
        border border-white/[0.08]
        shadow-[0_8px_32px_rgba(0,0,0,0.4),_0_0_1px_rgba(255,255,255,0.08)_inset]
        ${className}
      `}
    >
      {/* Subtle outer glow ring */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow:
            "0 0 40px rgba(255,106,0,0.04), 0 0 80px rgba(45,156,219,0.03), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-10 h-px bg-gradient-to-r from-orange/60 to-transparent" />
      <div className="absolute top-0 left-0 w-px h-10 bg-gradient-to-b from-orange/60 to-transparent" />
      <div className="absolute bottom-0 right-0 w-10 h-px bg-gradient-to-l from-blue-light/40 to-transparent" />
      <div className="absolute bottom-0 right-0 w-px h-10 bg-gradient-to-t from-blue-light/40 to-transparent" />

      {/* Glow highlights */}
      <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-orange/[0.06] blur-[90px] pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-48 h-48 rounded-full bg-blue-light/[0.06] blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5 border-b border-white/[0.06] pb-4">
        <Cpu className="w-4.5 h-4.5 text-orange animate-pulse" />
        <h3 className="font-orbitron tracking-widest text-[11px] md:text-xs font-bold text-orange-flame/90 uppercase">
          Problem Statement &amp; Mission Objectives
        </h3>
      </div>

      {/* Description */}
      <p className="text-white/75 text-sm md:text-[15px] leading-relaxed mb-5 font-body">
        Air pollution is a major health hazard in India. Ground monitoring stations are sparse
        and cannot provide complete nationwide coverage.
      </p>

      {/* Context quote */}
      <p className="text-white/55 text-xs md:text-sm leading-relaxed mb-6 bg-white/[0.025] px-4 py-3 rounded-xl border border-white/[0.04] font-body italic">
        BharatAQI leverages satellite observations, meteorological data, fire activity records,
        and deep learning models to generate high-resolution AQI maps and identify HCHO hotspots
        across the subcontinent.
      </p>

      {/* Objectives grid */}
      <div>
        <h4 className="font-display font-semibold text-white/80 text-xs mb-4 uppercase tracking-[0.15em] pl-[0.15em]">
          Mission Objectives:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {objectives.map((obj, index) => {
            const Icon = obj.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start gap-3 bg-white/[0.02] border border-white/[0.05] px-4 py-3.5 rounded-xl hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-300 group cursor-default"
              >
                <div className="mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-orange-flame/80 group-hover:text-orange-flame group-hover:scale-110 transition-all duration-300" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${obj.color} opacity-80`} />
                    <span className="font-display font-medium text-white/85 text-xs md:text-sm">
                      {obj.title}
                    </span>
                  </div>
                  <span className="text-white/45 text-[11px] md:text-xs leading-normal block">
                    {obj.desc}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
