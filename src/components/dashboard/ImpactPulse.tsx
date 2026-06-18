"use client"

import React from "react"
import { motion } from "framer-motion"

interface ImpactPulseProps {
  score: number; // 0 to 100
  categories: {
    transport: number; // 0 to 1
    energy: number;
    food: number;
    shopping: number;
  };
}

export function ImpactPulse({ score, categories }: ImpactPulseProps) {
  // Using eco-minimalist palette: Emerald, Teal, Lime
  const rings = [
    { name: "Transport", value: categories.transport, radius: 100, color: "#10B981" },
    { name: "Energy", value: categories.energy, radius: 80, color: "#14B8A6" },
    { name: "Food", value: categories.food, radius: 60, color: "#84CC16" },
    { name: "Shopping", value: categories.shopping, radius: 40, color: "#059669" },
  ];

  return (
    <div className="relative flex items-center justify-center h-full min-h-[300px]">
      <svg width="240" height="240" viewBox="0 0 240 240" className="transform -rotate-90">
        {rings.map((ring, i) => {
          const circumference = 2 * Math.PI * ring.radius;
          const strokeDashoffset = circumference - ring.value * circumference;
          
          return (
            <g key={ring.name}>
              {/* Background Ring */}
              <circle
                cx="120"
                cy="120"
                r={ring.radius}
                fill="transparent"
                stroke="currentColor"
                className="text-border"
                strokeWidth="8"
                opacity={0.3}
              />
              {/* Animated Value Ring */}
              <motion.circle
                cx="120"
                cy="120"
                r={ring.radius}
                fill="transparent"
                stroke={ring.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
              />
            </g>
          )
        })}
      </svg>

      {/* Center Score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-4xl font-bold text-primary"
        >
          {score}
        </motion.span>
        <span className="text-xs font-medium uppercase tracking-widest text-foreground/50">Pulse</span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-[-40px] left-0 right-0 flex justify-center gap-4 text-[10px] uppercase font-semibold text-foreground/70">
        {rings.map(ring => (
          <div key={ring.name} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ring.color }} />
            {ring.name}
          </div>
        ))}
      </div>
    </div>
  )
}
