"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { saveOnboardingData } from './actions'

const steps = [
  { id: 'transport', title: 'Transportation', desc: 'How do you usually get around?' },
  { id: 'food', title: 'Food', desc: 'What best describes your diet?' },
  { id: 'electricity', title: 'Electricity', desc: 'How energy efficient is your home?' },
  { id: 'shopping', title: 'Shopping', desc: 'What are your shopping habits?' },
  { id: 'waste', title: 'Waste Management', desc: 'How do you handle your waste?' }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const result = await saveOnboardingData(formData)
    if (result.success) {
      router.push('/dashboard')
    } else {
      setIsSubmitting(false)
      alert(result.error || 'Failed to save onboarding data.')
    }
  }

  const handleSelect = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const renderStepContent = (stepId: string) => {
    switch (stepId) {
      case 'transport':
        return (
          <div className="space-y-3">
            {['Car (Gasoline)', 'Car (EV)', 'Public Transit', 'Bicycle / Walking'].map(option => (
              <Button
                key={option}
                variant={formData[stepId] === option ? 'default' : 'outline'}
                className="w-full justify-start h-12"
                onClick={() => handleSelect(stepId, option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )
      case 'food':
        return (
          <div className="space-y-3">
            {['Heavy Meat Eater', 'Average', 'Pescatarian', 'Vegetarian', 'Vegan'].map(option => (
              <Button
                key={option}
                variant={formData[stepId] === option ? 'default' : 'outline'}
                className="w-full justify-start h-12"
                onClick={() => handleSelect(stepId, option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )
      case 'electricity':
        return (
          <div className="space-y-3">
            {['No energy saving measures', 'Basic (LEDs)', 'Advanced (Smart thermostat, efficient appliances)', '100% Renewable Energy'].map(option => (
              <Button
                key={option}
                variant={formData[stepId] === option ? 'default' : 'outline'}
                className="w-full justify-start h-auto py-3 text-left whitespace-normal"
                onClick={() => handleSelect(stepId, option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )
      case 'shopping':
        return (
          <div className="space-y-3">
            {['Frequent fast fashion & electronics', 'Average consumer', 'Mostly second-hand / sustainable brands', 'Minimalist (rarely buy new)'].map(option => (
              <Button
                key={option}
                variant={formData[stepId] === option ? 'default' : 'outline'}
                className="w-full justify-start h-auto py-3 text-left whitespace-normal"
                onClick={() => handleSelect(stepId, option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )
      case 'waste':
        return (
          <div className="space-y-3">
            {['Rarely recycle', 'Recycle basics (paper/plastic)', 'Recycle + Compost', 'Zero Waste lifestyle'].map(option => (
              <Button
                key={option}
                variant={formData[stepId] === option ? 'default' : 'outline'}
                className="w-full justify-start h-12 text-left"
                onClick={() => handleSelect(stepId, option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg mb-8 space-y-2">
        <div className="flex justify-between text-sm font-medium text-foreground/70">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="w-full max-w-lg relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
            // Accessibility: Respect prefers-reduced-motion is handled via global css override
          >
            <Card className="shadow-lg glass border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{steps[currentStep].title}</CardTitle>
                <CardDescription className="text-base">{steps[currentStep].desc}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderStepContent(steps[currentStep].id)}
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border/50 pt-6">
                <Button 
                  variant="ghost" 
                  onClick={handleBack} 
                  disabled={currentStep === 0 || isSubmitting}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={!formData[steps[currentStep].id] || isSubmitting}
                >
                  {isSubmitting ? 'Finalizing...' : (currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
