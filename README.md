# 🌱 CarbonMind AI

An AI-powered sustainability platform that helps users track, understand, and reduce their carbon footprint through personalized insights, carbon analytics, challenges, and an intelligent AI sustainability coach.

Built for **Google Virtual PromptWars**, organized by **Hack2Skill** in collaboration with **Google** and **Google for Developers**.

---

## 🚀 Live Demo

**Deployed Application:** [Add Deployment Link]

**GitHub Repository:** [Add GitHub Link]

---

## 🎯 Problem Statement

Many people want to live more sustainably but struggle to understand:

* How their daily activities affect the environment
* Which habits contribute most to carbon emissions
* What actions will have the biggest positive impact

CarbonMind AI transforms complex carbon data into simple, personalized, and actionable recommendations.

---

## ✨ Features

### 👤 Smart User Onboarding

Users complete a guided onboarding flow covering:

* Transportation habits
* Dietary preferences
* Energy consumption
* Shopping behavior
* Waste management practices

The system generates a personalized carbon profile and sustainability identity.

---

### 📊 Carbon Footprint Tracking

Users can log daily activities such as:

* Transportation
* Food consumption
* Electricity usage
* Shopping activities
* Waste generation

The platform calculates estimated carbon emissions using emission factor datasets.

---

### 📈 Impact Pulse Dashboard

A real-time sustainability dashboard displaying:

* Sustainability Score
* Total Carbon Emissions
* Activity Trends
* Environmental Impact Analytics
* Future Impact Projections

The score updates dynamically whenever new activities are logged.

---

### 🤖 AI Carbon Coach

Powered by OpenRouter and Gemini.

The AI Coach:

* Analyzes user behavior
* Understands sustainability profiles
* Provides personalized environmental guidance
* Suggests realistic carbon reduction strategies
* Maintains conversational context

---

### 💡 AI Insights Generator

Generates personalized recommendations such as:

* Transportation improvements
* Dietary optimizations
* Energy-saving actions
* Waste reduction opportunities

Each recommendation includes:

* Estimated carbon reduction
* Difficulty level
* Actionable guidance

---

### 🏆 Eco Challenges

Users can participate in sustainability challenges such as:

* Plastic-Free Week
* Zero Waste Week
* Energy Saving Challenge
* Sustainable Transport Challenge

Progress is tracked automatically.

---

### 🎖 Achievement System

Users unlock achievements as they improve sustainability habits.

Examples:

* Eco Beginner
* Sustainability Champion
* Carbon Reducer
* Green Guardian

---

### 🔐 Authentication & Security

Built with Supabase Authentication.

Features include:

* Secure signup/login
* Session management
* Protected dashboard routes
* Row-Level Security (RLS)
* User-specific data isolation

---

## 🏗 Architecture

User
↓
Next.js Frontend
↓
Server Actions & API Routes
↓
Supabase Database
↓
OpenRouter AI
↓
Gemini Model

---

## 🛠 Tech Stack

### Frontend

* Next.js 16
* TypeScript
* Tailwind CSS
* React

### Backend

* Next.js Server Actions
* API Routes

### Database

* Supabase PostgreSQL

### Authentication

* Supabase Auth

### AI

* OpenRouter
* Gemini 2.5 Flash

### Deployment

* Vercel

---

## 🌍 AI Localization

The platform has been localized for Indian users:

* Kilometers instead of miles
* Indian dietary recommendations
* Context-aware sustainability advice
* Localized AI Coach responses

---

## 🔍 Key Learnings

This project involved:

* Full-stack development
* AI integration
* Prompt engineering
* Database schema design
* Authentication systems
* Security auditing
* Production deployment
* End-to-end testing
* Performance optimization

---

## 📦 Installation

Clone the repository:

```bash
git clone <repository-url>
cd carbonmind-ai
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---


## 🙌 Acknowledgements

* Google
* Google for Developers
* Hack2Skill
* OpenRouter
* Supabase
* Vercel

---

## 📄 License

This project is created for educational, sustainability, and hackathon purposes.
