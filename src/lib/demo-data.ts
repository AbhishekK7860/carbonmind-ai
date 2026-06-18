export const demoUser = {
  id: "demo-user-123",
  full_name: "Alex Green",
  email: "alex@example.com",
  avatar_url: null,
};

export const demoProfile = {
  carbon_identity: "Climate Champion",
  total_emissions_kg: 3200,
  sustainability_score: 75,
};

export const demoRecommendations = [
  {
    id: "rec-1",
    title: "Switch to LED Bulbs",
    description: "Replace your remaining incandescent bulbs with LEDs to save energy.",
    estimated_reduction_kg: 45,
    difficulty_score: 2,
    is_completed: false,
  },
  {
    id: "rec-2",
    title: "Meatless Mondays",
    description: "Commit to eating vegetarian meals every Monday.",
    estimated_reduction_kg: 104,
    difficulty_score: 4,
    is_completed: false,
  },
  {
    id: "rec-3",
    title: "Bike to Work",
    description: "Use a bicycle for commuting twice a week instead of driving.",
    estimated_reduction_kg: 250,
    difficulty_score: 7,
    is_completed: false,
  }
];

export const demoHistory = [
  { date: "2024-05-01", amount: 15.2, category: "Transport" },
  { date: "2024-05-02", amount: 8.4, category: "Food" },
  { date: "2024-05-03", amount: 12.1, category: "Electricity" },
  { date: "2024-05-04", amount: 0, category: "Transport" },
  { date: "2024-05-05", amount: 5.5, category: "Waste" },
];

export const demoChallenges = [
  {
    id: "chal-1",
    title: "Plastic-Free Week",
    description: "Avoid single-use plastics entirely for a week.",
    category: "Waste",
    duration_days: 7,
    xp_reward: 100,
    status: "active",
    progress: 40, // percentage
  }
];

export const demoAchievements = [
  {
    id: "ach-1",
    title: "Eco Beginner",
    description: "Completed onboarding and logged first activity.",
    badge_icon_url: "/badges/eco-beginner.svg",
    unlocked_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "ach-2",
    title: "Green Warrior",
    description: "Reached 500 XP through challenges.",
    badge_icon_url: "/badges/green-warrior.svg",
    unlocked_at: "2024-04-20T14:30:00Z"
  }
];
