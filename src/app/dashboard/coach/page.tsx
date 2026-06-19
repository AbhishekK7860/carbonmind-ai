"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Leaf, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

async function sendMessage(messages: Message[]): Promise<string> {
  const res = await fetch('/api/coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) throw new Error('Failed to send message')
  const data = await res.json()
  return data.reply
}

const SUGGESTED_PROMPTS = [
  "What's the single highest-impact change I can make?",
  "How does my transport compare to average?",
  "Give me a 7-day green challenge plan",
  "Explain my sustainability score to me",
]

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hi! I'm your CarbonMind AI Coach 🌱\n\nI'm here to help you understand your carbon footprint and create a personalized sustainability plan. I have access to your profile and activity data, so my advice is tailored specifically to you.\n\nWhat would you like to explore today?" 
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text?: string) => {
    const content = text || input.trim()
    if (!content || loading) return

    const userMessage: Message = { role: 'user', content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const reply = await sendMessage(newMessages)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again in a moment! 🌿" 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const resetChat = () => {
    setMessages([{ 
      role: 'assistant', 
      content: "Hi! I'm your CarbonMind AI Coach 🌱\n\nI'm here to help you understand your carbon footprint and create a personalized sustainability plan. What would you like to explore today?" 
    }])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">AI Carbon Coach</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Your Sustainability Assistant</h1>
          <p className="text-white/40 text-sm mt-0.5">Powered by Gemini 2.5 Flash via OpenRouter</p>
        </div>
        <button
          onClick={resetChat}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          New chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' 
                  ? 'bg-emerald-500/20' 
                  : 'bg-purple-500/20'
              }`}>
                {msg.role === 'assistant' 
                  ? <Leaf className="w-4 h-4 text-emerald-400" />
                  : <User className="w-4 h-4 text-purple-400" />
                }
              </div>
              
              {/* Bubble */}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'assistant'
                  ? 'glass border border-white/5 text-white/80'
                  : 'bg-purple-500/20 border border-purple-500/20 text-white'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Loading indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="glass border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested prompts (shown when < 3 messages) */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 pb-3">
          {SUGGESTED_PROMPTS.map(prompt => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all duration-150"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="glass rounded-2xl border border-white/10 p-3 flex items-end gap-3 focus-within:border-purple-500/40 transition-colors">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your carbon footprint..."
          rows={1}
          disabled={loading}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 resize-none focus:outline-none leading-relaxed max-h-32 min-h-[1.5rem]"
          style={{ 
            height: 'auto',
            overflowY: input.split('\n').length > 3 ? 'auto' : 'hidden'
          }}
          onInput={e => {
            const el = e.currentTarget
            el.style.height = 'auto'
            el.style.height = Math.min(el.scrollHeight, 128) + 'px'
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-150 hover:scale-105 shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}
