import { Car, UserPreferences, CarRecommendation } from '@/types/car';
import { carDatabase } from '@/data/cars';

// Advanced ML-based recommendation system
interface UserVector {
  budgetPreference: number;
  fuelEfficiencyWeight: number;
  safetyWeight: number;
  performanceWeight: number;
  luxuryWeight: number;
  practicality: number;
  environmentalConcern: number;
}

interface CarVector {
  valueScore: number;
  efficiencyScore: number;
  safetyScore: number;
  performanceScore: number;
  luxuryScore: number;
  practicalityScore: number;
  environmentalScore: number;
}

// Convert user preferences to numerical vector for ML processing
export function createUserVector(preferences: UserPreferences): UserVector {
  const avgBudget = (preferences.budget.min + preferences.budget.max) / 2;
  
  return {
    budgetPreference: Math.min(avgBudget / 100000, 1), // Normalize to 0-1
    fuelEfficiencyWeight: preferences.fuelEfficiency.importance === 'high' ? 1 : 
                         preferences.fuelEfficiency.importance === 'medium' ? 0.6 : 0.3,
    safetyWeight: preferences.safetyRating.importance === 'high' ? 1 : 
                  preferences.safetyRating.importance === 'medium' ? 0.6 : 0.3,
    performanceWeight: preferences.priorities.includes('performance') || 
                      preferences.priorities.includes('driving_experience') ? 1 : 0.3,
    luxuryWeight: preferences.priorities.includes('comfort') || 
                  preferences.priorities.includes('prestige') ? 1 : 0.3,
    practicality: preferences.priorities.includes('practicality') || 
                  preferences.usage === 'family_use' ? 1 : 0.5,
    environmentalConcern: preferences.fuelType.includes('electric') || 
                         preferences.fuelType.includes('hybrid') ? 1 : 0.3
  };
}

// Convert car attributes to numerical vector
export function createCarVector(car: Car): CarVector {
  const isLuxury = car.segment === 'luxury' || car.price > 50000;
  const isPerformance = car.segment === 'sport' || car.type === 'coupe';
  
  return {
    valueScore: Math.max(0, 1 - (car.price / 80000)), // Inverse price relationship
    efficiencyScore: Math.min(car.fuelEfficiency / 50, 1), // Normalize MPG
    safetyScore: car.safetyRating / 5,
    performanceScore: isPerformance ? 0.9 : (car.type === 'sedan' ? 0.5 : 0.3),
    luxuryScore: isLuxury ? 0.9 : (car.segment === 'family' ? 0.4 : 0.2),
    practicalityScore: car.seatingCapacity >= 5 ? 0.8 : 0.4,
    environmentalScore: car.fuelType === 'electric' ? 1 : 
                       car.fuelType === 'hybrid' ? 0.8 : 0.2
  };
}

// Calculate cosine similarity between user and car vectors
export function calculateCosineSimilarity(userVec: UserVector, carVec: CarVector): number {
  const userArray = Object.values(userVec);
  const carArray = Object.values(carVec);
  
  let dotProduct = 0;
  let userMagnitude = 0;
  let carMagnitude = 0;
  
  for (let i = 0; i < userArray.length; i++) {
    dotProduct += userArray[i] * carArray[i];
    userMagnitude += userArray[i] * userArray[i];
    carMagnitude += carArray[i] * carArray[i];
  }
  
  const magnitude = Math.sqrt(userMagnitude) * Math.sqrt(carMagnitude);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

// Advanced scoring with multiple ML techniques
export function calculateAdvancedScore(car: Car, preferences: UserPreferences): number {
  const userVec = createUserVector(preferences);
  const carVec = createCarVector(car);
  
  // 1. Cosine similarity score (40% weight)
  const similarityScore = calculateCosineSimilarity(userVec, carVec) * 40;
  
  // 2. Feature matching score (20% weight)
  const userFeatures = new Set(preferences.features);
  const carFeatures = new Set(car.features);
  const commonFeatures = new Set([...userFeatures].filter(f => carFeatures.has(f)));
  const featureScore = userFeatures.size > 0 ? 
    (commonFeatures.size / userFeatures.size) * 20 : 10;
  
  // 3. Budget compatibility score (25% weight)
  let budgetScore = 0;
  if (car.price >= preferences.budget.min && car.price <= preferences.budget.max) {
    // Optimal budget range
    const budgetRange = preferences.budget.max - preferences.budget.min;
    const pricePosition = (car.price - preferences.budget.min) / budgetRange;
    // Prefer cars in the middle 60% of budget range
    budgetScore = 25 * (1 - Math.abs(pricePosition - 0.5) * 0.8);
  } else if (car.price < preferences.budget.min) {
    // Under budget - good but may lack features
    budgetScore = 20;
  } else {
    // Over budget - penalize based on how much over
    const overPercent = (car.price - preferences.budget.max) / preferences.budget.max;
    budgetScore = Math.max(0, 25 * (1 - overPercent * 2));
  }
  
  // 4. Reliability and ownership cost score (15% weight)
  const reliabilityScore = car.reliability / 10;
  const maintenanceScore = car.maintenanceCost === 'low' ? 1 : 
                          car.maintenanceCost === 'medium' ? 0.7 : 0.4;
  const ownershipScore = ((reliabilityScore + maintenanceScore) / 2) * 15;
  
  return Math.min(100, similarityScore + featureScore + budgetScore + ownershipScore);
}

// K-means clustering for car grouping
export function clusterCars(cars: Car[], k: number = 3): Car[][] {
  if (cars.length <= k) return cars.map(car => [car]);
  
  // Simple k-means clustering based on price and efficiency
  const points = cars.map(car => ({
    car,
    x: car.price / 100000, // Normalize price
    y: car.fuelEfficiency / 50 // Normalize efficiency
  }));
  
  // Initialize centroids randomly
  let centroids = [];
  for (let i = 0; i < k; i++) {
    const randomPoint = points[Math.floor(Math.random() * points.length)];
    centroids.push({ x: randomPoint.x, y: randomPoint.y });
  }
  
  // K-means iterations
  for (let iter = 0; iter < 10; iter++) {
    const clusters: typeof points[][] = Array(k).fill(null).map(() => []);
    
    // Assign points to nearest centroid
    points.forEach(point => {
      let minDist = Infinity;
      let clusterIndex = 0;
      
      centroids.forEach((centroid, i) => {
        const dist = Math.sqrt(
          Math.pow(point.x - centroid.x, 2) + 
          Math.pow(point.y - centroid.y, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = i;
        }
      });
      
      clusters[clusterIndex].push(point);
    });
    
    // Update centroids
    centroids = clusters.map(cluster => {
      if (cluster.length === 0) return centroids[0]; // Keep old centroid if empty
      
      const avgX = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length;
      const avgY = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length;
      return { x: avgX, y: avgY };
    });
  }
  
  // Final assignment
  const finalClusters: Car[][] = Array(k).fill(null).map(() => []);
  points.forEach(point => {
    let minDist = Infinity;
    let clusterIndex = 0;
    
    centroids.forEach((centroid, i) => {
      const dist = Math.sqrt(
        Math.pow(point.x - centroid.x, 2) + 
        Math.pow(point.y - centroid.y, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        clusterIndex = i;
      }
    });
    
    finalClusters[clusterIndex].push(point.car);
  });
  
  return finalClusters.filter(cluster => cluster.length > 0);
}

// Content-based collaborative filtering
export function getContentBasedRecommendations(preferences: UserPreferences): CarRecommendation[] {
  const userVec = createUserVector(preferences);
  
  const recommendations = carDatabase.map(car => {
    const advancedScore = calculateAdvancedScore(car, preferences);
    const carVec = createCarVector(car);
    const similarity = calculateCosineSimilarity(userVec, carVec);
    
    // Generate AI-powered reasons
    const reasons: string[] = [];
    const warnings: string[] = [];
    
    // Budget analysis
    if (car.price >= preferences.budget.min && car.price <= preferences.budget.max) {
      reasons.push(`Perfect budget match at $${car.price.toLocaleString()}`);
    } else if (car.price < preferences.budget.min) {
      reasons.push(`Great value under budget`);
    } else {
      warnings.push(`Over budget by $${(car.price - preferences.budget.max).toLocaleString()}`);
    }
    
    // AI similarity analysis
    if (similarity > 0.8) {
      reasons.push('Excellent match for your preferences');
    } else if (similarity > 0.6) {
      reasons.push('Good alignment with your needs');
    }
    
    // Environmental scoring
    if (userVec.environmentalConcern > 0.7 && carVec.environmentalScore > 0.7) {
      reasons.push('Eco-friendly choice matching your environmental priorities');
    }
    
    // Performance analysis
    if (userVec.performanceWeight > 0.7 && carVec.performanceScore > 0.7) {
      reasons.push('High-performance vehicle for driving enthusiasts');
    }
    
    // Reliability prediction
    if (car.reliability >= 8) {
      reasons.push(`Excellent reliability score (${car.reliability}/10)`);
    } else if (car.reliability < 6) {
      warnings.push(`Below-average reliability (${car.reliability}/10)`);
    }
    
    return {
      ...car,
      matchScore: Math.round(advancedScore),
      reasons,
      warnings,
      similarityScore: similarity
    } as CarRecommendation & { similarityScore: number };
  });
  
  return recommendations
    .filter(rec => rec.matchScore > 30) // Higher threshold for advanced system
    .sort((a, b) => b.matchScore - a.matchScore);
}

// Ensemble method combining multiple recommendation approaches
export function getEnsembleRecommendations(preferences: UserPreferences, limit: number = 10): CarRecommendation[] {
  // Get content-based recommendations
  const contentBased = getContentBasedRecommendations(preferences);
  
  // Apply clustering to diversify results
  const clusters = clusterCars(carDatabase, 3);
  const diversifiedRecs: CarRecommendation[] = [];
  
  // Get top recommendations from each cluster
  clusters.forEach(cluster => {
    const clusterRecs = cluster
      .map(car => {
        const score = calculateAdvancedScore(car, preferences);
        return contentBased.find(rec => rec.id === car.id) || {
          ...car,
          matchScore: Math.round(score),
          reasons: ['Diverse recommendation from similar vehicle cluster'],
          warnings: []
        } as CarRecommendation;
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, Math.ceil(limit / 3));
    
    diversifiedRecs.push(...clusterRecs);
  });
  
  // Combine and deduplicate
  const combined = [...contentBased, ...diversifiedRecs];
  const unique = combined.filter((rec, index, self) => 
    index === self.findIndex(r => r.id === rec.id)
  );
  
  return unique
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}