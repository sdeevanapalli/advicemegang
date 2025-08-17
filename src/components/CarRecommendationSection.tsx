import React, { useState } from 'react';
import { CarRecommendationForm } from '@/components/CarRecommendationForm';
import { CarRecommendationResults } from '@/components/CarRecommendationResults';
import { UserPreferences } from '@/types/car';
import { getCarRecommendations } from '@/utils/carRecommendation';

export default function CarRecommendationSection() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleRecommendationSubmit = async (preferences: UserPreferences) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const recommendedCars = getCarRecommendations(preferences);
      
      setRecommendations(recommendedCars);
      setShowResults(true);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setShowResults(false);
    setRecommendations([]);
  };

  return (
    <section id="recommendation" className="min-h-screen py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Find Your Perfect Car
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Answer a few questions about your preferences and budget, and we'll recommend the best cars for you
          </p>
        </div>

        {!showResults ? (
          <div className="max-w-4xl mx-auto">
            <CarRecommendationForm 
              onSubmit={handleRecommendationSubmit}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <CarRecommendationResults 
              recommendations={recommendations}
              onBackToForm={handleBackToForm}
            />
          </div>
        )}
      </div>
    </section>
  );
}