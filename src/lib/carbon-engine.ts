import { createClient } from '@supabase/supabase-js'

// Use anon client for public dictionary tables to allow aggressive caching
// and avoid Next.js dynamic header constraints during build/cache time.
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(supabaseUrl, supabaseKey)
}

export interface EmissionFactor {
  id: string;
  activity_name: string;
  category: string;
  value: number;
  unit: string;
  source: string;
  source_year: number;
}

export interface CalculationResult {
  emissions_kg: number;
  factor_id: string | null;
  is_estimated: boolean;
  source: string | null;
}

// Memory cache for factors to avoid redundant DB calls per request
let factorsCache: EmissionFactor[] | null = null;
let lastFetch = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function getEmissionFactors(): Promise<EmissionFactor[]> {
  const now = Date.now();
  if (factorsCache && now - lastFetch < CACHE_TTL) {
    return factorsCache;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('emission_factors')
    .select('*')

  if (error || !data) {
    console.error("Failed to fetch emission factors", error);
    return [];
  }

  factorsCache = data;
  lastFetch = now;
  return data;
}

export async function calculateEmissions(
  category: string,
  activity_name: string,
  amount: number
): Promise<CalculationResult> {
  const factors = await getEmissionFactors();
  
  // Try exact match
  let matchedFactor = factors.find(
    f => f.category.toLowerCase() === category.toLowerCase() && 
         f.activity_name.toLowerCase() === activity_name.toLowerCase()
  );

  // If no exact match, fallback to a category average proxy (if available)
  let isEstimated = false;
  if (!matchedFactor) {
    matchedFactor = factors.find(
      f => f.category.toLowerCase() === category.toLowerCase() && 
           f.activity_name.toLowerCase().includes('average')
    );
    isEstimated = true;
  }

  if (matchedFactor) {
    return {
      emissions_kg: Number((amount * matchedFactor.value).toFixed(2)),
      factor_id: matchedFactor.id,
      is_estimated: isEstimated,
      source: matchedFactor.source
    };
  }

  // Fallback if completely unknown
  return {
    emissions_kg: 0,
    factor_id: null,
    is_estimated: true,
    source: null
  };
}

// Helper methods for specific domains
export const CarbonEngine = {
  async calculateTransport(activity: string, miles: number) {
    return calculateEmissions('Transport', activity, miles);
  },
  async calculateFood(activity: string, kg: number) {
    return calculateEmissions('Food', activity, kg);
  },
  async calculateElectricity(activity: string, kwh: number) {
    return calculateEmissions('Electricity', activity, kwh);
  },
  async calculateShopping(activity: string, items_or_kg: number) {
    return calculateEmissions('Shopping', activity, items_or_kg);
  },
  async calculateWaste(activity: string, kg: number) {
    return calculateEmissions('Waste', activity, kg);
  }
}
