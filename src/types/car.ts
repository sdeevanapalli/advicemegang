export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  type: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'truck' | 'convertible';
  fuelType: 'gasoline' | 'hybrid' | 'electric' | 'diesel';
  fuelEfficiency: number; // mpg
  safetyRating: number; // 1-5 stars
  seatingCapacity: number;
  transmission: 'manual' | 'automatic' | 'cvt';
  drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd';
  features: string[];
  pros: string[];
  cons: string[];
  image: string;
  brand: string;
  segment: 'luxury' | 'economy' | 'sport' | 'family';
  reliability: number; // 1-10
  maintenanceCost: 'low' | 'medium' | 'high';
  resaleValue: number; // 1-10
}

export interface UserPreferences {
  budget: {
    min: number;
    max: number;
  };
  fuelEfficiency: {
    min: number;
    importance: 'low' | 'medium' | 'high';
  };
  carType: string[];
  fuelType: string[];
  seatingCapacity: number;
  transmission: string[];
  drivetrain: string[];
  features: string[];
  safetyRating: {
    min: number;
    importance: 'low' | 'medium' | 'high';
  };
  usage: 'daily_commute' | 'weekend_trips' | 'family_use' | 'business' | 'recreation';
  experience: 'first_time' | 'experienced' | 'enthusiast';
  priorities: string[];
}

export interface CarRecommendation extends Car {
  matchScore: number;
  reasons: string[];
  warnings: string[];
}