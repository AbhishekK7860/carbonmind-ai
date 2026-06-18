"use client"

import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CardDescription } from "../ui/card";

interface FutureProjectionProps {
  currentMonthlyEmissions: number;
  optimizedReductionPotential: number; // monthly reduction potential in kg
}

export function FutureProjection({ currentMonthlyEmissions, optimizedReductionPotential }: FutureProjectionProps) {
  // Deterministic calculation: Current Path is flat or slightly increasing based on history.
  // AI-Optimized Path represents adopting all Tier 1 recommendations linearly over time.
  
  const generateData = () => {
    const data = [];
    const months = ['Now', '1 Mo', '3 Mo', '6 Mo', '9 Mo', '12 Mo'];
    let currentPath = currentMonthlyEmissions;
    let optimizedPath = currentMonthlyEmissions;

    for (let i = 0; i < months.length; i++) {
      data.push({
        name: months[i],
        "Current Path": Math.round(currentPath),
        "Optimized Path": Math.round(optimizedPath),
      });
      // Current path slightly drifts up (e.g. 1% per month)
      currentPath = currentPath * 1.01;
      
      // Optimized path reduces over time as habits form
      if (i > 0) {
        optimizedPath = Math.max(0, optimizedPath - (optimizedReductionPotential / 5)); // Full potential reached by month 6 roughly
      }
    }
    return data;
  }

  const data = generateData();
  const yearEndSavings = data[data.length - 1]["Current Path"] - data[data.length - 1]["Optimized Path"];

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }}
              itemStyle={{ color: '#F8FAFC' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }}/>
            <Line type="monotone" dataKey="Current Path" stroke="#64748b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Optimized Path" stroke="#10B981" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-surface border border-border p-3 rounded-lg flex items-center justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-foreground/70">Potential 1-Year Savings</span>
          <span className="font-bold text-accent">{yearEndSavings} kg CO₂</span>
        </div>
        <div className="text-xs text-foreground/50 text-right max-w-[150px]">
          *Based on linear adoption of AI Action Center recommendations.
        </div>
      </div>
    </div>
  )
}
