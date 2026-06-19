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

const RINGS = [
  { key: 'transport' as const, name: "Transport", radius: 108, color: "#10B981", glow: "rgba(16,185,129,0.4)" },
  { key: 'energy' as const, name: "Energy", radius: 86, color: "#14B8A6", glow: "rgba(20,184,166,0.4)" },
  { key: 'food' as const, name: "Food", radius: 64, color: "#84CC16", glow: "rgba(132,204,22,0.4)" },
  { key: 'shopping' as const, name: "Shopping", radius: 42, color: "#8B5CF6", glow: "rgba(139,92,246,0.4)" },
]

export function ImpactPulse({ score, categories }: ImpactPulseProps) {
  const scoreColor = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444'
  const scoreLabel = score >= 70 ? 'Excellent' : score >= 40 ? 'Good' : 'Fair'

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 py-4">
      {/* SVG Ring Visualization */}
      <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
        <svg width="260" height="260" viewBox="0 0 260 260" className="transform -rotate-90">
          <defs>
            {RINGS.map(ring => (
              <filter key={ring.key} id={`glow-${ring.key}`}>
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            ))}
          </defs>
          {RINGS.map((ring, i) => {
            const value = categories[ring.key] || 0
            const circumference = 2 * Math.PI * ring.radius
            const dashOffset = circumference - Math.max(0.03, value) * circumference

            return (
              <g key={ring.key}>
                {/* Track ring */}
                <circle
                  cx="130" cy="130"
                  r={ring.radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="10"
                />
                {/* Value ring with animation */}
                <motion.circle
                  cx="130" cy="130"
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 1.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{ filter: `drop-shadow(0 0 6px ${ring.glow})` }}
                />
              </g>
            )
          })}
        </svg>

        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="text-5xl font-bold" style={{ color: scoreColor }}>
              {score}
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: scoreColor }}>
              {scoreLabel}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="flex-1 w-full space-y-4">
        {RINGS.map((ring, i) => {
          const value = categories[ring.key] || 0
          const pct = Math.round(value * 100)
          return (
            <motion.div
              key={ring.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="group"
            >
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ring.color, boxShadow: `0 0 6px ${ring.glow}` }} />
                  <span className="font-medium text-white/70 group-hover:text-white transition-colors">{ring.name}</span>
                </div>
                <span className="font-bold tabular-nums" style={{ color: ring.color }}>{pct}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: ring.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </motion.div>
          )
        })}
        {(Object.values(categories).every(v => v === 0)) && (
          <p className="text-sm text-white/30 text-center py-4">
            Log activities to see your breakdown
          </p>
        )}
      </div>
    </div>
  )
}
