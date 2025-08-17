import { Car, UserPreferences, CarRecommendation } from '@/types/car';
import { carDatabase } from '@/data/cars';

export function calculateCarScore(car: Car, preferences: UserPreferences): CarRecommendation {
  let score = 0;
  let maxScore = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];

  // Budget scoring (25% weight)
  const budgetWeight = 25;
  if (car.price >= preferences.budget.min && car.price <= preferences.budget.max) {
    score += budgetWeight;
    reasons.push(`Within your budget of $${preferences.budget.min.toLocaleString()} - $${preferences.budget.max.toLocaleString()}`);
  } else if (car.price < preferences.budget.min) {
    score += budgetWeight * 0.8;
    reasons.push('Very affordable option');
  } else {
    const overBudget = ((car.price - preferences.budget.max) / preferences.budget.max) * 100;
    if (overBudget <= 20) {
      score += budgetWeight * 0.5;
      warnings.push(`${overBudget.toFixed(1)}% over budget`);
    } else {
      warnings.push(`Significantly over budget by $${(car.price - preferences.budget.max).toLocaleString()}`);
    }
  }
  maxScore += budgetWeight;

  // Car type scoring (15% weight)
  const typeWeight = 15;
  if (preferences.carType.includes(car.type)) {
    score += typeWeight;
    reasons.push(`Matches your preferred ${car.type} body style`);
  }
  maxScore += typeWeight;

  // Fuel type scoring (10% weight)
  const fuelTypeWeight = 10;
  if (preferences.fuelType.includes(car.fuelType)) {
    score += fuelTypeWeight;
    reasons.push(`Uses your preferred ${car.fuelType} fuel type`);
  }
  maxScore += fuelTypeWeight;

  // Fuel efficiency scoring (importance-based weight)
  const fuelEfficiencyWeight = preferences.fuelEfficiency.importance === 'high' ? 20 : 
                              preferences.fuelEfficiency.importance === 'medium' ? 15 : 10;
  if (car.fuelEfficiency >= preferences.fuelEfficiency.min) {
    const efficiencyBonus = Math.min((car.fuelEfficiency - preferences.fuelEfficiency.min) / 10, 1);
    score += fuelEfficiencyWeight * (1 + efficiencyBonus * 0.5);
    reasons.push(`Excellent fuel efficiency: ${car.fuelEfficiency} MPG`);
  } else {
    const deficiency = preferences.fuelEfficiency.min - car.fuelEfficiency;
    score += Math.max(0, fuelEfficiencyWeight * (1 - deficiency / 20));
    warnings.push(`Lower fuel efficiency than preferred (${car.fuelEfficiency} vs ${preferences.fuelEfficiency.min} MPG)`);
  }
  maxScore += fuelEfficiencyWeight;

  // Safety rating scoring (importance-based weight)
  const safetyWeight = preferences.safetyRating.importance === 'high' ? 15 : 
                      preferences.safetyRating.importance === 'medium' ? 10 : 5;
  if (car.safetyRating >= preferences.safetyRating.min) {
    score += safetyWeight * (car.safetyRating / 5);
    if (car.safetyRating === 5) {
      reasons.push('Top 5-star safety rating');
    } else {
      reasons.push(`Good ${car.safetyRating}-star safety rating`);
    }
  } else {
    warnings.push(`Safety rating below your minimum (${car.safetyRating} vs ${preferences.safetyRating.min} stars)`);
  }
  maxScore += safetyWeight;

  // Seating capacity scoring (5% weight)
  const seatingWeight = 5;
  if (car.seatingCapacity >= preferences.seatingCapacity) {
    score += seatingWeight;
    if (car.seatingCapacity > preferences.seatingCapacity) {
      reasons.push(`Extra seating capacity (${car.seatingCapacity} seats)`);
    } else {
      reasons.push(`Perfect seating capacity (${car.seatingCapacity} seats)`);
    }
  } else {
    warnings.push(`Limited seating (${car.seatingCapacity} vs ${preferences.seatingCapacity} needed)`);
  }
  maxScore += seatingWeight;

  // Features scoring (10% weight)
  const featuresWeight = 10;
  const matchingFeatures = car.features.filter(feature => 
    preferences.features.includes(feature)
  );
  if (matchingFeatures.length > 0) {
    const featureScore = (matchingFeatures.length / preferences.features.length) * featuresWeight;
    score += featureScore;
    reasons.push(`Has ${matchingFeatures.length} of your desired features`);
  }
  maxScore += featuresWeight;

  // Add segment-specific bonuses
  switch (car.segment) {
    case 'luxury':
      if (preferences.priorities.includes('comfort') || preferences.priorities.includes('prestige')) {
        score += 5;
        reasons.push('Luxury segment matches your priorities');
      }
      break;
    case 'economy':
      if (preferences.priorities.includes('value') || preferences.priorities.includes('fuel_economy')) {
        score += 5;
        reasons.push('Economy segment offers great value');
      }
      break;
    case 'sport':
      if (preferences.priorities.includes('performance') || preferences.priorities.includes('driving_experience')) {
        score += 5;
        reasons.push('Sport segment delivers performance');
      }
      break;
    case 'family':
      if (preferences.priorities.includes('practicality') || preferences.priorities.includes('safety')) {
        score += 5;
        reasons.push('Family-oriented vehicle');
      }
      break;
  }

  // Calculate final percentage score
  const finalScore = Math.min(100, (score / maxScore) * 100);

  return {
    ...car,
    matchScore: Math.round(finalScore),
    reasons,
    warnings
  };
}

export function getCarRecommendations(preferences: UserPreferences): CarRecommendation[] {
  const recommendations = carDatabase
    .map(car => calculateCarScore(car, preferences))
    .filter(rec => rec.matchScore > 20) // Filter out very poor matches
    .sort((a, b) => b.matchScore - a.matchScore);

  return recommendations;
}

export function getTopRecommendations(preferences: UserPreferences, limit: number = 5): CarRecommendation[] {
  return getCarRecommendations(preferences).slice(0, limit);
}