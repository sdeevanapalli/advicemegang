import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CarRecommendationForm } from '@/components/CarRecommendationForm';
import { CarRecommendationResults } from '@/components/CarRecommendationResults';
import { UserPreferences, CarRecommendation } from '@/types/car';
import { getEnsembleRecommendations } from '@/utils/advancedMLRecommendation';
import { Car, Sparkles, Target, Award } from 'lucide-react';

const Index = () => {
  const [step, setStep] = useState<'welcome' | 'form' | 'results'>('welcome');
  const [recommendations, setRecommendations] = useState<CarRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setStep('form');
  };

  const handleFormSubmit = async (preferences: UserPreferences) => {
    setIsLoading(true);
    
    // Simulate AI processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Use advanced ML ensemble recommendations
    const results = getEnsembleRecommendations(preferences, 10);
    setRecommendations(results);
    setIsLoading(false);
    setStep('results');
  };

  const handleStartOver = () => {
    setStep('form');
    setRecommendations([]);
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Car className="h-16 w-16 text-primary" />
                  <Sparkles className="h-6 w-6 text-accent absolute -top-2 -right-2" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                CarAdvisor AI
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Find your perfect car using advanced AI and machine learning. Our intelligent recommendation system uses ensemble algorithms, clustering, and similarity scoring to suggest the best vehicles for your unique needs.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Personalized Matching</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Advanced ML algorithms use cosine similarity, clustering, and feature matching to find cars that truly fit your unique profile.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent/50 transition-colors">
                <CardHeader className="text-center">
                  <Sparkles className="h-8 w-8 text-accent mx-auto mb-2" />
                  <CardTitle>Smart Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get detailed explanations for why each car matches you, plus important considerations you might miss.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-luxury/50 transition-colors">
                <CardHeader className="text-center">
                  <Award className="h-8 w-8 text-luxury mx-auto mb-2" />
                  <CardTitle>Expert Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Compare cars side-by-side with reliability scores, maintenance costs, and resale values.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="space-y-6 pt-8">
              <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Ready to find your perfect car?</h2>
                <p className="text-muted-foreground mb-6">
                  Our comprehensive questionnaire takes just 3-5 minutes and provides personalized recommendations from our database of popular vehicles.
                </p>
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="text-lg px-8 py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  Get Started Now
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>✓ Free recommendations • ✓ No registration required • ✓ Takes 3-5 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Tell Us About Your Dream Car</h1>
              <p className="text-muted-foreground">
                Answer a few questions to get personalized recommendations
              </p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-6">
              <CarRecommendationForm 
                onSubmit={handleFormSubmit} 
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <CarRecommendationResults 
            recommendations={recommendations}
            onStartOver={handleStartOver}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
