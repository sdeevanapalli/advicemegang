import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CarRecommendation } from '@/types/car';
import { Star, Fuel, Users, DollarSign, Shield, Award, AlertTriangle, Heart, Car, Zap } from 'lucide-react';

interface CarRecommendationResultsProps {
  recommendations: CarRecommendation[];
  onStartOver: () => void;
}

export function CarRecommendationResults({ recommendations, onStartOver }: CarRecommendationResultsProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  const toggleFavorite = (carId: string) => {
    setFavorites(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-orange-500';
    return 'text-destructive';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'luxury': return <Award className="h-4 w-4" />;
      case 'sport': return <Zap className="h-4 w-4" />;
      case 'economy': return <DollarSign className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'luxury': return 'luxury';
      case 'sport': return 'sport';
      case 'economy': return 'economy';
      default: return 'primary';
    }
  };

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Recommendations Found</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't find any cars that match your criteria. Try adjusting your preferences.
          </p>
          <Button onClick={onStartOver}>Adjust Preferences</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Car Recommendations</h2>
          <p className="text-muted-foreground">
            Found {recommendations.length} cars that match your preferences
          </p>
        </div>
        <Button variant="outline" onClick={onStartOver}>
          Start Over
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="comparison">Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4">
            {recommendations.map((car, index) => (
              <Card key={car.id} className="relative overflow-hidden">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <Badge variant={getScoreVariant(car.matchScore)} className="font-semibold">
                    {car.matchScore}% Match
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(car.id)}
                    className={favorites.includes(car.id) ? 'text-red-500' : 'text-muted-foreground'}
                  >
                    <Heart className={`h-4 w-4 ${favorites.includes(car.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">
                        {index + 1}. {car.year} {car.make} {car.model}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`bg-${getSegmentColor(car.segment)} text-${getSegmentColor(car.segment)}-foreground`}
                        >
                          {getSegmentIcon(car.segment)}
                          <span className="ml-1 capitalize">{car.segment}</span>
                        </Badge>
                        <Badge variant="outline" className="capitalize">{car.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <Progress value={car.matchScore} className="w-full" />
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">${car.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-primary" />
                      <span className="text-sm">{car.fuelEfficiency} MPG</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < car.safetyRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm">{car.seatingCapacity} seats</span>
                    </div>
                  </div>

                  {car.reasons.length > 0 && (
                    <div>
                      <h4 className="font-medium text-accent mb-2">Why this car fits you:</h4>
                      <ul className="text-sm space-y-1">
                        {car.reasons.slice(0, 3).map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {car.warnings.length > 0 && (
                    <div>
                      <h4 className="font-medium text-orange-600 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Considerations:
                      </h4>
                      <ul className="text-sm space-y-1">
                        {car.warnings.slice(0, 2).map((warning, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {car.features.slice(0, 5).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {car.features.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{car.features.length - 5} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed">
          <div className="grid gap-6">
            {recommendations.map((car) => (
              <Card key={car.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {car.year} {car.make} {car.model}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {car.segment} • {car.type} • {car.fuelType}
                      </CardDescription>
                    </div>
                    <Badge variant={getScoreVariant(car.matchScore)} className="text-lg px-3 py-1">
                      {car.matchScore}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Pricing & Value</h4>
                      <div className="text-sm space-y-1">
                        <p>Price: <span className="font-medium">${car.price.toLocaleString()}</span></p>
                        <p>Resale Value: <span className="font-medium">{car.resaleValue}/10</span></p>
                        <p>Maintenance: <span className="capitalize font-medium">{car.maintenanceCost}</span></p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Performance & Efficiency</h4>
                      <div className="text-sm space-y-1">
                        <p>Fuel Economy: <span className="font-medium">{car.fuelEfficiency} MPG</span></p>
                        <p>Transmission: <span className="capitalize font-medium">{car.transmission}</span></p>
                        <p>Drivetrain: <span className="uppercase font-medium">{car.drivetrain}</span></p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Safety & Reliability</h4>
                      <div className="text-sm space-y-1">
                        <p>Safety Rating: <span className="font-medium">{car.safetyRating}/5 stars</span></p>
                        <p>Reliability: <span className="font-medium">{car.reliability}/10</span></p>
                        <p>Seating: <span className="font-medium">{car.seatingCapacity} seats</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-accent mb-3">Pros</h4>
                      <ul className="space-y-2">
                        {car.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-accent mt-1">+</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-600 mb-3">Cons</h4>
                      <ul className="space-y-2">
                        {car.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-orange-600 mt-1">-</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {car.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {car.reasons.length > 0 && (
                    <div>
                      <h4 className="font-medium text-accent mb-3">Perfect Match Reasons</h4>
                      <ul className="space-y-2">
                        {car.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-accent mt-1">✓</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {car.warnings.length > 0 && (
                    <div>
                      <h4 className="font-medium text-orange-600 mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Important Considerations
                      </h4>
                      <ul className="space-y-2">
                        {car.warnings.map((warning, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-orange-600 mt-1">!</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Top 3 Recommendations Comparison</CardTitle>
              <CardDescription>Side-by-side comparison of your best matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Specification</th>
                      {recommendations.slice(0, 3).map((car) => (
                        <th key={car.id} className="text-center p-3">
                          <div className="space-y-1">
                            <p className="font-medium">{car.make} {car.model}</p>
                            <Badge variant={getScoreVariant(car.matchScore)} className="text-xs">
                              {car.matchScore}%
                            </Badge>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Price', key: 'price', format: (v: any) => `$${v.toLocaleString()}` },
                      { label: 'Fuel Economy', key: 'fuelEfficiency', format: (v: any) => `${v} MPG` },
                      { label: 'Safety Rating', key: 'safetyRating', format: (v: any) => `${v}/5 stars` },
                      { label: 'Reliability', key: 'reliability', format: (v: any) => `${v}/10` },
                      { label: 'Seating', key: 'seatingCapacity', format: (v: any) => `${v} seats` },
                      { label: 'Maintenance', key: 'maintenanceCost', format: (v: any) => v },
                      { label: 'Resale Value', key: 'resaleValue', format: (v: any) => `${v}/10` }
                    ].map((spec) => (
                      <tr key={spec.key} className="border-b">
                        <td className="p-3 font-medium">{spec.label}</td>
                        {recommendations.slice(0, 3).map((car) => (
                          <td key={car.id} className="text-center p-3">
                            {spec.format(car[spec.key] as any)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {favorites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Your Favorites
            </CardTitle>
            <CardDescription>Cars you've marked as favorites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations
                .filter(car => favorites.includes(car.id))
                .map(car => (
                  <div key={car.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">{car.year} {car.make} {car.model}</span>
                    <Badge variant="secondary">{car.matchScore}% Match</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}