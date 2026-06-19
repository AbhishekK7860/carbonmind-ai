"use client"

import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'

interface FutureProjectionProps {
  currentMonthlyEmissions: number;
  optimizedReductionPotential: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f1d35] border border-white/10 rounded-xl p-3 shadow-xl text-xs">
        <p className="text-white/50 mb-2 font-medium">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span style={{ color: entry.color }} className="font-semibold">
              {entry.value.toFixed(1)} kg CO₂
            </span>
            <span className="text-white/40">{entry.name}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function FutureProjection({ currentMonthlyEmissions, optimizedReductionPotential }: FutureProjectionProps) {
  const months = ['Now', '1 Mo', '2 Mo', '3 Mo', '6 Mo', '9 Mo', '12 Mo']
  const monthIndices = [0, 1, 2, 3, 6, 9, 12]
  
  const data = months.map((name, i) => {
    const idx = monthIndices[i]
    // Current path: slight 1% monthly increase (BAU scenario)
    const currentPath = currentMonthlyEmissions * Math.pow(1.01, idx)
    // Optimized path: linear reduction reaching full potential by month 6
    const reductionProgress = Math.min(1, idx / 6)
    const optimizedPath = Math.max(
      currentMonthlyEmissions * 0.4, // floor at 40% reduction
      currentMonthlyEmissions - (optimizedReductionPotential * reductionProgress)
    )
    return {
      name,
      "Current Path": Math.round(currentPath),
      "Optimized Path": Math.round(optimizedPath),
    }
  })

  const yearEndSavings = data[data.length - 1]["Current Path"] - data[data.length - 1]["Optimized Path"]
  const yearEndSavingsPct = ((yearEndSavings / data[data.length - 1]["Current Path"]) * 100).toFixed(0)

  return (
    <div className="space-y-6">
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#475569" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#475569' }}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#475569' }}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '11px', color: '#64748b', paddingTop: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="Current Path" 
              stroke="#475569" 
              strokeWidth={2} 
              dot={false}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="Optimized Path" 
              stroke="#10B981" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 5, fill: '#10B981', stroke: '#080f1e', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary strip */}
      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
        <div>
          <div className="text-xs text-white/40 mb-0.5">Potential 12-Month Savings</div>
          <div className="text-xl font-bold text-emerald-400">
            {yearEndSavings} kg CO₂ <span className="text-sm font-normal text-emerald-400/60">({yearEndSavingsPct}% reduction)</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/30 max-w-[180px] leading-relaxed">
            *Based on your logged history and completing AI recommendations
          </div>
        </div>
      </div>
    </div>
  )
}
