export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  city: string;
  dietary_preference: string;
  medical_conditions: string;
  physical_limitations: string;
  latest_cgm: number;
  mood: string;
}

export interface CGMReading {
  timestamp: Date;
  value: number;
}

export interface MoodEntry {
  timestamp: Date;
  mood: string;
}

export interface FoodEntry {
  timestamp: Date;
  description: string;
  estimatedCarbs?: number;
  estimatedProtein?: number;
  estimatedFat?: number;
}

export interface MealPlan {
  meal: string;
  time: string;
  description: string;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
    calories: number;
  };
}
