"use client"

import { logActivity } from "@/app/actions/activity"
import { Car, Zap, ShoppingBag, Leaf, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useFormStatus } from "react-dom"

const CATEGORIES = [
  { name: 'Transport', icon: <Car className="w-5 h-5" />, color: '#10B981', unit: 'miles' },
  { name: 'Food', icon: <Leaf className="w-5 h-5" />, color: '#84CC16', unit: 'kg' },
  { name: 'Electricity', icon: <Zap className="w-5 h-5" />, color: '#F59E0B', unit: 'kWh' },
  { name: 'Shopping', icon: <ShoppingBag className="w-5 h-5" />, color: '#8B5CF6', unit: 'items' },
  { name: 'Waste', icon: <Trash2 className="w-5 h-5" />, color: '#64748b', unit: 'kg' },
]

const QUICK_FILL = [
  { name: 'Gasoline Car', activity: 'Passenger Car (Gasoline)', unit: 'miles', category: 'Transport' },
  { name: 'EV Car', activity: 'Passenger Car (EV)', unit: 'miles', category: 'Transport' },
  { name: 'Beef', activity: 'Beef (Average)', unit: 'kg', category: 'Food' },
  { name: 'Electricity', activity: 'Grid Electricity', unit: 'kWh', category: 'Electricity' },
  { name: 'Flight', activity: 'Flight (Short Haul, Economy)', unit: 'miles', category: 'Transport' },
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit"
      disabled={pending}
      className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-500/25 text-sm"
    >
      {pending ? 'Calculating...' : 'Calculate & Save Activity'}
    </button>
  )
}

export default function LogActivityPage() {
  const [activityName, setActivityName] = useState('')
  const [unit, setUnit] = useState('')
  const [category, setCategory] = useState('Transport')

  const handleQuickFill = (fill: typeof QUICK_FILL[0]) => {
    setActivityName(fill.activity)
    setUnit(fill.unit)
    setCategory(fill.category)
  }

  return (
    <div className="max-w-2xl mx-auto pb-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to dashboard
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Carbon Tracker</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Log Activity</h1>
        <p className="text-white/40 mt-1">Record your actions to calculate your carbon footprint.</p>
      </div>

      {/* Category icons */}
      <div className="grid grid-cols-5 gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => setCategory(cat.name)}
            className={`glass rounded-xl p-3 text-center border transition-colors ${
              category === cat.name ? 'border-emerald-500/40' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex justify-center mb-1.5" style={{ color: cat.color }}>{cat.icon}</div>
            <div className="text-xs font-medium text-white/60">{cat.name}</div>
          </button>
        ))}
      </div>

      {/* Quick fill */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs text-white/30 self-center">Quick fill:</span>
        {QUICK_FILL.map(fill => (
          <button
            key={fill.name}
            type="button"
            onClick={() => handleQuickFill(fill)}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-emerald-400/70 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
          >
            {fill.name}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-8 gradient-border">
        <form action={logActivity} className="space-y-6">
          {/* Hidden category field synced with state */}
          <input type="hidden" name="category" value={category} />

          {/* Activity Name */}
          <div className="space-y-2">
            <label htmlFor="activity_name" className="block text-xs font-semibold text-white/70 uppercase tracking-wide">
              Activity Name
            </label>
            <input 
              id="activity_name" 
              name="activity_name" 
              required
              value={activityName}
              onChange={e => setActivityName(e.target.value)}
              placeholder="e.g., Passenger Car (Gasoline)"
              className="w-full h-11 rounded-xl px-4 text-sm border border-white/10 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all bg-white/5 text-white placeholder:text-white/20"
            />
          </div>

          {/* Amount & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-xs font-semibold text-white/70 uppercase tracking-wide">
                Amount
              </label>
              <input 
                id="amount" 
                name="amount" 
                type="number" 
                step="0.01" 
                min="0"
                required
                placeholder="10"
                className="w-full h-11 rounded-xl px-4 text-sm border border-white/10 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all bg-white/5 text-white placeholder:text-white/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="unit" className="block text-xs font-semibold text-white/70 uppercase tracking-wide">
                Unit
              </label>
              <input 
                id="unit" 
                name="unit" 
                required
                value={unit}
                onChange={e => setUnit(e.target.value)}
                placeholder="miles, kg, kWh..."
                className="w-full h-11 rounded-xl px-4 text-sm border border-white/10 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all bg-white/5 text-white placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Info box */}
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 text-xs text-white/40 leading-relaxed">
            💡 <strong className="text-white/60">Emission factors</strong> are sourced from US EPA 2024 and UK DEFRA 2024. 
            Activity names must match exactly for precise calculation. Unrecognized activities use a category average.
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
