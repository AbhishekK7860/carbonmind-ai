-- Phase 1: Seed Data

-- 1. EMISSION FACTORS (Sourced from US EPA 2024 and UK DEFRA 2024)
INSERT INTO public.emission_factors (activity_name, category, value, unit, source, source_year) VALUES
-- Transport (EPA Emission Factors for Greenhouse Gas Inventories 2024)
('Passenger Car (Gasoline)', 'Transport', 0.335, 'kgCO2e/mile', 'US EPA GHG Emission Factors Hub', 2024),
('Passenger Car (EV)', 'Transport', 0.102, 'kgCO2e/mile', 'US EPA GHG Emission Factors Hub', 2024), -- Based on average grid mix
('Bus (Transit)', 'Transport', 0.053, 'kgCO2e/passenger-mile', 'US EPA GHG Emission Factors Hub', 2024),
('Train (Commuter Rail)', 'Transport', 0.154, 'kgCO2e/passenger-mile', 'US EPA GHG Emission Factors Hub', 2024),
('Flight (Short Haul, Economy)', 'Transport', 0.246, 'kgCO2e/passenger-mile', 'UK DEFRA GHG Conversion Factors', 2024),

-- Electricity/Energy (EPA eGRID 2022 data published 2024 - US National Average)
('Grid Electricity', 'Electricity', 0.386, 'kgCO2e/kWh', 'US EPA eGRID (National Average)', 2024),
('Natural Gas (Residential)', 'Electricity', 5.302, 'kgCO2e/therm', 'US EPA GHG Emission Factors Hub', 2024),

-- Food (Based on various LCA databases, compiled by Poore & Nemecek, referenced by DEFRA)
('Beef (Average)', 'Food', 99.48, 'kgCO2e/kg', 'Poore & Nemecek / UK DEFRA', 2024),
('Chicken', 'Food', 9.87, 'kgCO2e/kg', 'Poore & Nemecek / UK DEFRA', 2024),
('Tofu', 'Food', 3.16, 'kgCO2e/kg', 'Poore & Nemecek / UK DEFRA', 2024),
('Rice', 'Food', 4.45, 'kgCO2e/kg', 'Poore & Nemecek / UK DEFRA', 2024),
('Vegetables (Average)', 'Food', 0.40, 'kgCO2e/kg', 'Poore & Nemecek / UK DEFRA', 2024),

-- Waste (EPA WARM Model)
('Landfill Waste', 'Waste', 0.48, 'kgCO2e/kg', 'US EPA WARM Model', 2024),
('Recycling (Mixed Paper)', 'Waste', -0.83, 'kgCO2e/kg', 'US EPA WARM Model', 2024), -- Negative implies avoided emissions

-- Shopping (DEFRA Supply Chain factors)
('Clothing (Cotton)', 'Shopping', 24.3, 'kgCO2e/kg', 'UK DEFRA Supply Chain Factors', 2024),
('Electronics (Smartphone)', 'Shopping', 60.0, 'kgCO2e/item', 'UK DEFRA Supply Chain Factors', 2024);

-- 1.5 CONVERSION CONSTANTS (For AI Equivalencies)
INSERT INTO public.conversion_constants (name, description, value, unit) VALUES
('laptop_day_kgco2e', 'Emissions from powering a standard laptop for a day', 0.05, 'kgCO2e'),
('tree_year_kgco2e', 'Amount of carbon absorbed by a mature tree in one year', 21.77, 'kgCO2e'),
('car_mile_kgco2e', 'Average passenger car emissions per mile', 0.335, 'kgCO2e');


-- 2. ECO CHALLENGES
INSERT INTO public.eco_challenges (title, description, category, duration_days, xp_reward) VALUES
('Plastic-Free Week', 'Avoid single-use plastics entirely for a week.', 'Waste', 7, 100),
('Public Transport Week', 'Use only public transport or active travel for all commuting.', 'Transport', 7, 150),
('Meatless Monday', 'Eat purely plant-based meals for one day.', 'Food', 1, 50),
('Energy Saver', 'Unplug appliances when not in use and turn off lights.', 'Electricity', 7, 75);


-- 3. ACHIEVEMENTS
INSERT INTO public.achievements (title, description, badge_icon_url, required_xp) VALUES
('Eco Beginner', 'Logged your first activity and completed onboarding.', '/badges/eco-beginner.svg', 0),
('Green Warrior', 'Reached 500 XP through challenges and consistent logging.', '/badges/green-warrior.svg', 500),
('Climate Champion', 'Reached 2000 XP and significantly reduced carbon footprint.', '/badges/climate-champion.svg', 2000),
('Earth Guardian', 'Reached 5000 XP. You are a true sustainability leader.', '/badges/earth-guardian.svg', 5000);
