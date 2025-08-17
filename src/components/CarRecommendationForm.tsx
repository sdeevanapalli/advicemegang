import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPreferences } from '@/types/car';
import { carFeatures } from '@/data/cars';
import { Car, DollarSign, Fuel, Shield, Users, Settings, Star, Target } from 'lucide-react';

interface CarRecommendationFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading?: boolean;
}

export function CarRecommendationForm({ onSubmit, isLoading }: CarRecommendationFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: { min: 20000, max: 50000 },
    fuelEfficiency: { min: 25, importance: 'medium' },
    carType: [],
    fuelType: [],
    seatingCapacity: 5,
    transmission: [],
    drivetrain: [],
    features: [],
    safetyRating: { min: 4, importance: 'high' },
    usage: 'daily_commute',
    experience: 'experienced',
    priorities: []
  });

  const handleCheckboxChange = (
    field: 'carType' | 'fuelType' | 'transmission' | 'drivetrain' | 'features' | 'priorities',
    value: string,
    checked: boolean
  ) => {
    setPreferences(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Budget Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Budget Range
          </CardTitle>
          <CardDescription>What's your budget for a new car?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minBudget">Minimum Budget</Label>
              <Input
                id="minBudget"
                type="number"
                value={preferences.budget.min}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  budget: { ...prev.budget, min: Number(e.target.value) }
                }))}
                placeholder="$20,000"
              />
            </div>
            <div>
              <Label htmlFor="maxBudget">Maximum Budget</Label>
              <Input
                id="maxBudget"
                type="number"
                value={preferences.budget.max}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  budget: { ...prev.budget, max: Number(e.target.value) }
                }))}
                placeholder="$50,000"
              />
            </div>
          </div>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Budget range: ${preferences.budget.min.toLocaleString()} - ${preferences.budget.max.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Car Type Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Vehicle Type
          </CardTitle>
          <CardDescription>Which body styles interest you? (Select all that apply)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['sedan', 'suv', 'hatchback', 'coupe', 'truck', 'convertible'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={preferences.carType.includes(type)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('carType', type, checked as boolean)
                  }
                />
                <Label htmlFor={type} className="capitalize">{type}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fuel Type Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-primary" />
            Fuel Type Preference
          </CardTitle>
          <CardDescription>What fuel types are you considering?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['gasoline', 'hybrid', 'electric', 'diesel'].map((fuel) => (
              <div key={fuel} className="flex items-center space-x-2">
                <Checkbox
                  id={fuel}
                  checked={preferences.fuelType.includes(fuel)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('fuelType', fuel, checked as boolean)
                  }
                />
                <Label htmlFor={fuel} className="capitalize">{fuel}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fuel Efficiency Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-accent" />
            Fuel Efficiency
          </CardTitle>
          <CardDescription>How important is fuel economy to you?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Minimum MPG: {preferences.fuelEfficiency.min}</Label>
            <Slider
              value={[preferences.fuelEfficiency.min]}
              onValueChange={(value) => setPreferences(prev => ({
                ...prev,
                fuelEfficiency: { ...prev.fuelEfficiency, min: value[0] }
              }))}
              max={60}
              min={15}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="fuelImportance">Importance Level</Label>
            <Select
              value={preferences.fuelEfficiency.importance}
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                setPreferences(prev => ({
                  ...prev,
                  fuelEfficiency: { ...prev.fuelEfficiency, importance: value }
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Safety Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            Safety Requirements
          </CardTitle>
          <CardDescription>What's your minimum safety rating requirement?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Minimum Safety Rating: {preferences.safetyRating.min} stars</Label>
            <Slider
              value={[preferences.safetyRating.min]}
              onValueChange={(value) => setPreferences(prev => ({
                ...prev,
                safetyRating: { ...prev.safetyRating, min: value[0] }
              }))}
              max={5}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="safetyImportance">Safety Importance</Label>
            <Select
              value={preferences.safetyRating.importance}
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                setPreferences(prev => ({
                  ...prev,
                  safetyRating: { ...prev.safetyRating, importance: value }
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Seating Capacity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Seating Capacity
          </CardTitle>
          <CardDescription>How many seats do you need?</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Minimum Seats: {preferences.seatingCapacity}</Label>
            <Slider
              value={[preferences.seatingCapacity]}
              onValueChange={(value) => setPreferences(prev => ({
                ...prev,
                seatingCapacity: value[0]
              }))}
              max={8}
              min={2}
              step={1}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transmission and Drivetrain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Technical Preferences
          </CardTitle>
          <CardDescription>Transmission and drivetrain preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Transmission Type</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {['manual', 'automatic', 'cvt'].map((trans) => (
                <div key={trans} className="flex items-center space-x-2">
                  <Checkbox
                    id={trans}
                    checked={preferences.transmission.includes(trans)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('transmission', trans, checked as boolean)
                    }
                  />
                  <Label htmlFor={trans} className="capitalize">{trans}</Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Drivetrain</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {['fwd', 'rwd', 'awd', '4wd'].map((drive) => (
                <div key={drive} className="flex items-center space-x-2">
                  <Checkbox
                    id={drive}
                    checked={preferences.drivetrain.includes(drive)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('drivetrain', drive, checked as boolean)
                    }
                  />
                  <Label htmlFor={drive} className="uppercase">{drive}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage and Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Usage & Experience
          </CardTitle>
          <CardDescription>How will you use the car?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="usage">Primary Usage</Label>
            <Select
              value={preferences.usage}
              onValueChange={(value: any) => setPreferences(prev => ({ ...prev, usage: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily_commute">Daily Commuting</SelectItem>
                <SelectItem value="weekend_trips">Weekend Trips</SelectItem>
                <SelectItem value="family_use">Family Use</SelectItem>
                <SelectItem value="business">Business Use</SelectItem>
                <SelectItem value="recreation">Recreation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="experience">Car Buying Experience</Label>
            <Select
              value={preferences.experience}
              onValueChange={(value: any) => setPreferences(prev => ({ ...prev, experience: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first_time">First-time Buyer</SelectItem>
                <SelectItem value="experienced">Experienced Buyer</SelectItem>
                <SelectItem value="enthusiast">Car Enthusiast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Priorities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Your Priorities
          </CardTitle>
          <CardDescription>What matters most to you in a car?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'fuel_economy', 'performance', 'comfort', 'safety', 'reliability', 
              'value', 'prestige', 'practicality', 'driving_experience', 'technology'
            ].map((priority) => (
              <div key={priority} className="flex items-center space-x-2">
                <Checkbox
                  id={priority}
                  checked={preferences.priorities.includes(priority)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('priorities', priority, checked as boolean)
                  }
                />
                <Label htmlFor={priority} className="capitalize text-sm">
                  {priority.replace('_', ' ')}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Desired Features */}
      <Card>
        <CardHeader>
          <CardTitle>Desired Features</CardTitle>
          <CardDescription>Select features that are important to you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {carFeatures.slice(0, 15).map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={preferences.features.includes(feature)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('features', feature, checked as boolean)
                  }
                />
                <Label htmlFor={feature} className="text-sm">{feature}</Label>
              </div>
            ))}
          </div>
          {preferences.features.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Selected features:</p>
              <div className="flex flex-wrap gap-2">
                {preferences.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={isLoading || preferences.carType.length === 0 || preferences.fuelType.length === 0}
      >
        {isLoading ? 'Finding Your Perfect Car...' : 'Get My Car Recommendations'}
      </Button>
    </form>
  );
}